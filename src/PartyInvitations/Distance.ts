// TODO: Test
/**
 * Distance records the distance between two points.
 */
export class Distance {
  /**
   * The distance in kilometers.
   * Can be converted in getters if other units are desired.
   */
  private readonly distanceInKm;

  constructor({ distanceInKm }: { distanceInKm: number }) {
    this.distanceInKm = distanceInKm;
  }

  /**
   * @returns the distance in kilometers.
   */
  public get km(): number {
    return this.distanceInKm;
  }

  /**
   * Creates a new distance with the distance given in kilometers.
   */
  public static newKm({ distance }: { distance: number }): Distance {
    return new Distance({ distanceInKm: distance });
  }

  /**
   * @returns true if this distance is less than the other distance,
   *          false otherwise.
   */
  public lessThan(other: Distance): boolean {
    return this.km < other.km;
  }
}
