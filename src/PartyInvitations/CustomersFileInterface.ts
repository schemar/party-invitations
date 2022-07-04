import { Customer } from './Customer.js';

export interface CustomersFileInterface {
  readCustomersOrThrow: ({
    filePath,
  }: {
    filePath: string;
  }) => Promise<{ customers: Customer[]; warnings: string[] }>;
}
