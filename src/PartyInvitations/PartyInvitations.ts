import { Customer } from './Customer.js';
import { CustomersProviderInterface } from './CustomersProviderInterface.js';
import { Distance } from './Distance.js';
import { GreatCircleDistanceInterface } from './GreatCircleDistanceInterface.js';
import { Position } from './Position.js';

/**
 * PartyInvitations finds customers within a given radius.
 */
export class PartyInvitations {
  /** Used to calculate the distance between the party location and each customer. */
  private readonly greatCircleDistance: GreatCircleDistanceInterface;
  /** Used to retrieve customers from a source. */
  private readonly customersProvider: CustomersProviderInterface;

  constructor({
    greatCircleDistance,
    customersProvider,
  }: {
    greatCircleDistance: GreatCircleDistanceInterface;
    customersProvider: CustomersProviderInterface;
  }) {
    this.greatCircleDistance = greatCircleDistance;
    this.customersProvider = customersProvider;
  }

  /**
   * Returns all customers that have their offices within `radius` around `position`.
   *
   * Also returns warnings for malformed data and/or customers.
   * The customers come from the provider of this instance.
   */
  public async invitedCustomersOrThrow({
    position,
    radius,
    customersFilePath,
  }: {
    position: Position;
    radius: Distance;
    customersFilePath: string;
  }): Promise<{ customers: Customer[]; warnings: string[] }> {
    let customers: Customer[];
    let warnings: string[];
    try {
      const providerResponse =
        await this.customersProvider.readCustomersOrThrow({
          fileIdentifier: customersFilePath,
        });
      customers = providerResponse.customers;
      warnings = providerResponse.warnings;
    } catch (error) {
      throw new Error(
        `Cannot get customers from provider. ${error.toString()}`,
      );
    }

    customers = customers.filter((customer: Customer) => {
      const distance = this.greatCircleDistance.distance({
        positionOne: position,
        positionTwo: customer.position,
      });
      return distance.lessThan(radius);
    });

    // Simply forward the warnings from the provider.
    // The caller can act on them if they want to.
    return { customers, warnings };
  }
}
