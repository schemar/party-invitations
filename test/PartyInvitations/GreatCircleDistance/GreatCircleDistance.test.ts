import { GreatCircleDistance } from '../../../src/PartyInvitations/GreatCircleDistance/GreatCircleDistance';

describe('GreatCircleDistance', () => {
  // Adding the city names for more verbose test output.
  // Add more test cases in a prod environment, with more edge cases close to the min/max lat/lon.
  const distanceCases = [
    {
      positionOne: {
        city: 'Berlin',
        latitude: 52.5244,
        longitude: 13.4105,
      },
      positionTwo: {
        city: 'London',
        latitude: 51.5085,
        longitude: -0.1257,
      },
      expectedDistanceInKm: '932',
    },
    {
      positionOne: {
        city: 'Hong Kong',
        latitude: 22.39643,
        longitude: 114.1095,
      },
      positionTwo: {
        city: 'San Francisco',
        latitude: 37.77493,
        longitude: -122.41942,
      },
      expectedDistanceInKm: '11094',
    },
  ];
  test.each(distanceCases)(
    'Should calculate the correct distance: %p',
    ({ positionOne, positionTwo, expectedDistanceInKm }) => {
      // Arrange
      const greatCircleDistance = GreatCircleDistance.newEarth();

      // Act
      const distance = greatCircleDistance.distance({
        positionOne,
        positionTwo,
      });

      // Assert
      expect(distance.km.toFixed(0)).toStrictEqual(expectedDistanceInKm);
    },
  );
});
