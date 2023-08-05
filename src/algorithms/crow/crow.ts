import {findClosestColour} from './findClosestColour';

export interface PixelData {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
}

export const crow = (
  roadPixels: PixelData[],
  redPixels: PixelData[],
  bluePixels: PixelData[]
) => {
  return roadPixels.map((pixel: PixelData) =>
    findClosestColour(pixel, redPixels, bluePixels)
  );
};
