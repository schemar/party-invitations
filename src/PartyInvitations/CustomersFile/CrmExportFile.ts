import fs from 'fs/promises';
import { EOL } from 'os';
import { Customer } from '../Customer.js';
import { CustomersFileInterface } from '../CustomersFileInterface.js';

// TODO: Rename. Not a CSV file in the classical sense.
export class CrmExportFile implements CustomersFileInterface {
  private readonly CUSTOMER_ID_REGEX =
    /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{8}/;
  // TODO: Implement and test readCustomers.
  public async readCustomersOrThrow({
    filePath,
  }: {
    filePath: string;
  }): Promise<{ customers: Customer[]; warnings: string[] }> {
    let fileContent: string;
    try {
      fileContent = await fs.readFile(filePath, { encoding: 'utf8' });
    } catch (error) {
      throw new Error(`Cannot read file at '${filePath}'. ${error.toString()}`);
    }

    const fileLines = fileContent.split(EOL);

    return this.extractCustomer(fileLines);
  }

  private extractCustomer(fileLines: string[]): {
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
