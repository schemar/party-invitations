import { Customer } from './Customer.js';
import { CustomersFileInterface } from './CustomersFileInterface.js';
import { Distance } from './Distance.js';
import { GreatCircleDistanceInterface } from './GreatCircleDistanceInterface.js';
import { Position } from './Position.js';

export class PartyInvitations {
  private readonly greatCircleDistance: GreatCircleDistanceInterface;
  private readonly customersFile: CustomersFileInterface;

  constructor({
    greatCircleDistance,
    customersFile,
  }: {
    greatCircleDistance: GreatCircleDistanceInterface;
    customersFile: CustomersFileInterface;
  }) {
    this.greatCircleDistance = greatCircleDistance;
    this.customersFile = customersFile;
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
      const readResults = await this.customersFile.readCustomersOrThrow({
        filePath: customersFilePath,
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
