import { Distance } from '../../src/PartyInvitations/Distance.js';

// Expand these unit tests with unit conversion if distance supports more units
// than kilometers.
describe('Distance', () => {
  it('returns the correct distance in kilometers', () => {
    // Arrange
    const distanceInKm = 1873.43;
    // Act
    const distance = Distance.newKm({ distance: distanceInKm });
    // Assert
    expect(distance.km).toStrictEqual(distanceInKm);
  });
});
