import { EOL } from 'os';
import { Customer } from '../Customer.js';
import { CustomersProviderInterface } from '../CustomersProviderInterface.js';
import { FileProvider } from './FileProvider.js';

/**
 * CrmExportProvider extracts customers from data in a CRM export.
 *
 * The expected format of a CRM export is as follows:
 * 1. One customer per line.
 * 2. Each line contains comma-separated key-value pairs.
 * 3. Key and value are separated by a colon.
 * 4. Spaces between separators are optoinal.
 * 5. Valid keys are: id, lat, long
 *    - id: The id of the customer. Must be in the correct format.
 *    - lat: The latitude of the location of the customer.
 *    - long: The langitude of the location of the customer.
 * 6. Latitude and longitude must be decimal values.
 *
 * Examples:
 * id: 12345678-1234-1234-1234-12345678, long: 13.1, lat: 52.2
 * id: 00000000-0000-0000-0000-00000000, lat: 53.3, long: 13.3
 */
export class CrmExportProvider implements CustomersProviderInterface {
  /** All customer IDs from the CRM export must match this regular expression. */
  private readonly CUSTOMER_ID_REGEX =
    /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{8}/;

  // The current implementation is only a file provider. However, this
  // abstraction makes it easy in the future to expand the concept to other
  // providers, for example from a database or a web API.
  private readonly contentProvider: FileProvider;

  /**
   * Uses the content provider to get the CRM export.
   */
  public constructor({ contentProvider }: { contentProvider: FileProvider }) {
    this.contentProvider = contentProvider;
  }

  /**
   * Returns the customers and warnings from reading data from the given fileIdentifier.
   *
   * Adds warnings for malformed data that comes from the provider.
   * Returns customers despite warnings, as long as they are complete.
   */
  public async readCustomersOrThrow({
    fileIdentifier,
  }: {
    fileIdentifier: string;
  }): Promise<{ customers: Customer[]; warnings: string[] }> {
    let fileContent: string;
    try {
      fileContent = await this.contentProvider.getContent({ fileIdentifier });
    } catch (error) {
      throw new Error(
        `Cannot read file at '${fileIdentifier}'. ${error.toString()}`,
      );
    }

    const fileLines = fileContent.split(EOL);

    return this.extractCustomers(fileLines);
  }

  /**
   * Extracts the customers from the given lines, one customer per line.
   */
  private extractCustomers(fileLines: string[]): {
    customers: Customer[];
    warnings: string[];
  } {
    const customers: Customer[] = [];
    const warnings: string[] = [];

    type CustomerInFile = {
      id: string | undefined;
      position: {
        latitude: number | undefined;
        longitude: number | undefined;
      };
    };

    fileLines
      .filter((line) => line.length > 0)
      .forEach((line) => {
        const fields = line
          .split(',')
          .map((field: string) => field.trim())
          .filter((field) => field.length > 0);
        const customer = fields.reduce<CustomerInFile>(
          (customer: CustomerInFile, field: string) => {
            const [key, value] = field
              .split(':')
              .map((keyOrValue: string) => keyOrValue.trim());

            // TODO: cleanup
            let parsedNumber: number;
            switch (key) {
              case 'id':
                if (customer.id !== undefined) {
                  warnings.push(
                    `Multiple IDs defined for customer: '${customer.id}', '${value}'`,
                  );
                }

                if (!this.CUSTOMER_ID_REGEX.test(value)) {
                  warnings.push(`Invalid customer id: '${value}'`);
                } else {
                  customer.id = value;
                }
                break;
              case 'lat':
                if (customer.position.latitude !== undefined) {
                  warnings.push(
                    `Multiple Latitudes defined for customer: '${customer.position.latitude}', '${value}'`,
                  );
                }

                parsedNumber = Number.parseFloat(value);
                if (Number.isNaN(parsedNumber)) {
                  warnings.push(`Given latitude is not a number: '${value}'`);
                } else {
                  customer.position.latitude = parsedNumber;
                }
                break;
              case 'long':
                if (customer.position.longitude !== undefined) {
                  warnings.push(
                    `Multiple Longitudes defined for customer: '${customer.position.longitude}', '${value}'`,
                  );
                }

                parsedNumber = Number.parseFloat(value);
                if (Number.isNaN(parsedNumber)) {
                  warnings.push(`Given longitude is not a number: '${value}'`);
                } else {
                  customer.position.longitude = parsedNumber;
                }
                break;
              default:
                warnings.push(
                  `Unknown data field for customer: '${key}: ${value}'`,
                );
            }

            return customer;
          },
          {
            position: { latitude: undefined, longitude: undefined },
            id: undefined,
          },
        );

        if (
          customer.id === undefined ||
          customer.position.longitude === undefined ||
          customer.position.latitude === undefined
        ) {
          warnings.push(
            `Incomplete customer won't be considered: ${JSON.stringify(
              customer,
            )}`,
          );
        } else {
          if (
            customers.some((otherCustomer) => otherCustomer.id === customer.id)
          ) {
            warnings.push(`Multiple customers with same id: '${customer.id}'`);
          }
          // Adding a complete customer. Fields were checked:
          customers.push(customer as Customer);
        }
      });

    return { customers, warnings };
  }
}
