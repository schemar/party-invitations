import { Distance } from '../../src/PartyInvitations/Distance.js';
import { PartyInvitations } from '../../src/PartyInvitations/PartyInvitations.js';

const mockDistance = jest.fn();
const mockCustomers = jest.fn();
const mockGreatCircleDistance = { distance: mockDistance };
const mockProvider = { readCustomersOrThrow: mockCustomers };

// The `any`s in this file should be fixed, but I did not have the time to set
// up correct mocking.
/* eslint-disable @typescript-eslint/no-explicit-any */
describe('PartyInvitations', () => {
  beforeEach(() => {
    // Reset all mocks to not accidentally have test data leak between tests.
    jest.resetAllMocks();
  });

  it('returns only customers within the given radius', async () => {
    // Arrange
    mockCustomers.mockResolvedValueOnce({
      customers: ['1', '2'],
      warnings: [],
    });
    mockDistance.mockReturnValueOnce(Distance.newKm({ distance: 1 }));
    mockDistance.mockReturnValueOnce(Distance.newKm({ distance: 200 }));

    const partyInvitations = new PartyInvitations({
      greatCircleDistance: mockGreatCircleDistance as any,
      customersProvider: mockProvider as any,
    });

    // Act
    const { customers, warnings } =
      await partyInvitations.invitedCustomersOrThrow({
        position: { latitude: 52, longitude: 13 },
        radius: Distance.newKm({ distance: 100 }),
        customersFilePath: 'mocked',
      });

    // Assert
    expect(customers).toStrictEqual(['1']);
    expect(warnings).toStrictEqual([]);
  });

  it('forwards warnings', async () => {
    // Arrange
    mockCustomers.mockResolvedValueOnce({
      customers: [],
      warnings: ['warning about customer'],
    });

    const partyInvitations = new PartyInvitations({
      greatCircleDistance: mockGreatCircleDistance as any,
      customersProvider: mockProvider as any,
    });

    // Act
    const { warnings } = await partyInvitations.invitedCustomersOrThrow({
      position: { latitude: 52, longitude: 13 },
      radius: Distance.newKm({ distance: 100 }),
      customersFilePath: 'mocked',
    });

    // Assert
    expect(warnings).toStrictEqual(['warning about customer']);
  });

  it('throws when the customer provider throws', async () => {
    // Arrange
    mockCustomers.mockRejectedValueOnce('throwing I/O');

    const partyInvitations = new PartyInvitations({
      greatCircleDistance: mockGreatCircleDistance as any,
      customersProvider: mockProvider as any,
    });

    // Act and Assert
    return expect(
      partyInvitations.invitedCustomersOrThrow({
        position: { latitude: 52, longitude: 13 },
        radius: Distance.newKm({ distance: 100 }),
        customersFilePath: 'mocked',
      }),
    ).rejects.toThrow('throwing I/O');
  });
});
