import { Customer } from './Customer.js';

export interface CustomersProviderInterface {
  readCustomersOrThrow: ({
    fileIdentifier,
  }: {
    fileIdentifier: string;
  }) => Promise<{ customers: Customer[]; warnings: string[] }>;
}
