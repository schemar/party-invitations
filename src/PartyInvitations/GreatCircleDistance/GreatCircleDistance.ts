import { Distance } from '../Distance.js';
import { GreatCircleDistanceInterface } from '../GreatCircleDistanceInterface.js';
import { Position } from '../Position.js';

const RADIUS_OF_EARTH_IN_KM = 6371;

/**
 * Use GreatCircleDistance to calculate the distance between two points on a sphere.
 */
export class GreatCircleDistance implements GreatCircleDistanceInterface {
  private readonly radiusOfSphereInKm;

  constructor({ radiusOfSphereInKm }: { radiusOfSphereInKm: number }) {
    this.radiusOfSphereInKm = radiusOfSphereInKm;
  }

  /**
   * Create a new instance of GreatCircleDistance that uses earth's average
   * radius for distance calculations.
   */
  public static newEarth(): GreatCircleDistance {
    return new GreatCircleDistance({
      radiusOfSphereInKm: RADIUS_OF_EARTH_IN_KM,
    });
  }

  /**
   * Returns the distance between two points on a sphere.
   *
   * Expects given latitudes and longitudes to be given in degrees.
   * Note that, for earth, the calculation is not 100% precise:
   * 1. Earth's radius is not the same everywhere.
   *    This function assumes a perfect sphere when it calculates the distance.
   * 2. Elevation is not taken into account.
   */
  public distance({
    positionOne,
    positionTwo,
  }: {
    positionOne: Position;
    positionTwo: Position;
  }): Distance {
    // Convert degrees to radiance:
    const [latitudeOne, longitudeOne, latitudeTwo, longitudeTwo] = [positionOne.latitude, positionOne.longitude, positionTwo.latitude, positionTwo.longitude].map(degrees => degrees * (Math.PI / 180));

    // Computation of distance based on "Great-circle distance".
    // For more details see "https://en.wikipedia.org/wiki/Great-circle_distance".
    // If more accuracy is required, consider using the special case of the
    // Vincenty formula, as described in the Wikipedia article.
    let h =
        Math.pow(
          Math.sin((latitudeTwo - latitudeOne) / 2),
          2
        ) +
          (Math.cos(latitudeOne) * Math.cos(latitudeTwo) * Math.pow(Math.sin((longitudeTwo - longitudeOne)/2), 2))

    // As per the Wikipedia article, make sure that rounding errors do not lead
    // to an `h` greater than one.
    h = Math.min(1.0, h);

    const distanceInKm = 2 * this.radiusOfSphereInKm * Math.asin(Math.sqrt(h));

    return Distance.newKm({ distance: distanceInKm });
  }
}
