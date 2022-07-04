import { Distance } from './Distance.js';
import { Position } from './Position.js';

export interface GreatCircleDistanceInterface {
  distance: ({
    positionOne,
    positionTwo,
  }: {
    positionOne: Position;
    positionTwo: Position;
  }) => Distance;
}
