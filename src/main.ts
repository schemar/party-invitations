import { Customer } from './PartyInvitations/Customer.js';
import { CrmExportProvider } from './PartyInvitations/CustomersProviders/CrmExportProvider.js';
import { FileProvider } from './PartyInvitations/CustomersProviders/FileProvider.js';
import { Distance } from './PartyInvitations/Distance.js';
import { GreatCircleDistance } from './PartyInvitations/GreatCircleDistance/GreatCircleDistance.js';
import { PartyInvitations } from './PartyInvitations/PartyInvitations.js';

// See README.md for details on how to use this program.

const ERROR_CODE_ENV_MISSING = 1;
const ERROR_CODE_ENV_NOT_A_NUMBER = 2;
const ERROR_CODE_CANNOT_GET_CUSTOMERS = 3;

/** The prefix for all environment variables. */
const environmentPrefix = 'PI_';

/**
 * Reads a value of an environment variable and transforms it.
 *
 * Exits the process if the requested variable is not set.
 * Exits, because the program can not proceed when an environment variable is
 * missing.
 */
const readFromEnvironmentOrExit = <T>({
  environmentVariable,
  transformer,
}: {
  environmentVariable: string;
  transformer: (input: string) => T;
}): T => {
  const envValue = process.env[`${environmentPrefix}${environmentVariable}`];
  if (envValue === undefined) {
    console.error(
      `Environment variable missing. Cannot continue. Missing variable: ${environmentVariable}`,
    );
    process.exit(ERROR_CODE_ENV_MISSING);
  }

  return transformer(envValue);
};

/**
 * Returns a parsed number from a string.
 *
 * Exits the process if the parsed result is "Not a Number".
 * Exits, because the program can not proceed when an environment variable is
 * missing.
 */
const transformNumber = (input: string): number => {
  const parsed = Number.parseFloat(input);

  if (Number.isNaN(parsed)) {
    console.error(
      `Cannot parse a given number from the environment: '${input}'`,
    );
    process.exit(ERROR_CODE_ENV_NOT_A_NUMBER);
  }

  return parsed;
};

/** Prints the warnings, then the IDs of the customers within the radius. */
const printCustomerIdsAndWarningsToStdOut = async ({
  invitedCustomers,
  customerWarnings,
  radius,
  latitude,
  longitude,
}: {
  invitedCustomers: Customer[];
  customerWarnings: string[];
  radius: Distance;
  latitude: number;
  longitude: number;
}) => {
  console.warn(
    'The following warnings were encountered while processing the data:',
  );
  customerWarnings.forEach((warning) => console.warn(warning));
  console.log();

  invitedCustomers.sort((customerOne: Customer, customerTwo: Customer) =>
    customerOne.id.localeCompare(customerTwo.id),
  );

  // Mirror the input back to the user to ensure correctness.
  // Depending on the execution mode, it may be desired to no have this output
  // and instead only print out parseable customer IDs. This output could be
  // removed or made configurable in that case.
  // Same for warnings.
  console.log(
    `Customer IDs within ${radius.km} km of ${latitude} lat, ${longitude} lon (in alphabetical order):`,
  );
  invitedCustomers.forEach((customer) => {
    console.log(customer.id);
  });
};

/** Main reads the environment/config, runs the program, and prints the result. */
const main = async () => {
  const radius: Distance = readFromEnvironmentOrExit({
    environmentVariable: 'RADIUS_IN_KM',
    transformer: (input: string) =>
      Distance.newKm({ distance: transformNumber(input) }),
  });
  const latitude: number = readFromEnvironmentOrExit({
    environmentVariable: 'LATITUDE',
    transformer: transformNumber,
  });
  const longitude: number = readFromEnvironmentOrExit({
    environmentVariable: 'LONGITUDE',
    transformer: transformNumber,
  });
  const customersFilePath: string = readFromEnvironmentOrExit({
    environmentVariable: 'CUSTOMERS_FILE',
    transformer: (input: string) => input,
  });

  const greatCircleDistance = GreatCircleDistance.newEarth();
  const fileProvider = new FileProvider();
  const customersProvider = new CrmExportProvider({
    contentProvider: fileProvider,
  });
  const partyInvitations = new PartyInvitations({
    greatCircleDistance,
    customersProvider,
  });

  let invitedCustomers: Customer[];
  let customerWarnings: string[];
  try {
    const invitationResults = await partyInvitations.invitedCustomersOrThrow({
      position: { latitude, longitude },
      radius,
      customersFilePath,
    });
    invitedCustomers = invitationResults.customers;
    customerWarnings = invitationResults.warnings;
  } catch (error) {
    console.error('Cannot get customers. Aborting.', error.toString());
    process.exit(ERROR_CODE_CANNOT_GET_CUSTOMERS);
  }

  await printCustomerIdsAndWarningsToStdOut({
    invitedCustomers,
    customerWarnings,
    radius,
    latitude,
    longitude,
  });

  process.exit(0);
};

main();
