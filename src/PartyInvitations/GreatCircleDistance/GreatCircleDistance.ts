import { Distance } from '../Distance.js';
import { GreatCircleDistanceInterface } from '../GreatCircleDistanceInterface.js';
import { Position } from '../Position.js';

const RADIUS_OF_EARTH_IN_KM = 6371;

export class GreatCircleDistance implements GreatCircleDistanceInterface {
  private readonly radiusOfSphereInKm;

  constructor({ radiusOfSphereInKm }: { radiusOfSphereInKm: number }) {
    this.radiusOfSphereInKm = radiusOfSphereInKm;
  }

  public static newEarth(): GreatCircleDistance {
    return new GreatCircleDistance({
      radiusOfSphereInKm: RADIUS_OF_EARTH_IN_KM,
    });
  }

  // TODO: Implement and test distance().
  // TODO: Document origin.
  public distance({
    positionOne,
    positionTwo,
  }: {
    positionOne: Position;
    positionTwo: Position;
  }): Distance {
    const p = Math.PI / 180;
    const a =
      0.5 -
      Math.cos((positionTwo.latitude - positionOne.latitude) * p) / 2 +
      (Math.cos(positionOne.latitude * p) *
        Math.cos(positionTwo.latitude * p) *
        (1 - Math.cos((positionTwo.longitude - positionOne.longitude) * p))) /
        2;

    const distanceInKm = 2 * this.radiusOfSphereInKm * Math.asin(Math.sqrt(a));

    return Distance.newKm({ distance: distanceInKm });
  }
}
