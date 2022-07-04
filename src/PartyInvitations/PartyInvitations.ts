import { Customer } from './Customer.js';
import { CustomersProviderInterface } from './CustomersProviderInterface.js';
import { Distance } from './Distance.js';
import { GreatCircleDistanceInterface } from './GreatCircleDistanceInterface.js';
import { Position } from './Position.js';

// TODO: Documentation
export class PartyInvitations {
  private readonly greatCircleDistance: GreatCircleDistanceInterface;
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

  // TODO: Test and implement invitedCustomers();
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
      const readResults = await this.customersProvider.readCustomersOrThrow({
        fileIdentifier: customersFilePath,
      });
      customers = readResults.customers;
      warnings = readResults.warnings;
    } catch (error) {
      throw new Error(`Cannot get customers from file. ${error.toString()}`);
    }

    customers = customers.filter((customer: Customer) => {
      const distance = this.greatCircleDistance.distance({
        positionOne: position,
        positionTwo: customer.position,
      });
      return distance.lessThan(radius);
    });

    return { customers, warnings };
  }
}
