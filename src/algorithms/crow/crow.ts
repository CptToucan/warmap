import {findPixelDistanceSquared} from './findPixelDistance';

export interface PixelData {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
}

// Note to me and other future devs, we square here as to avoid having to
// do a computationally expensive Math.sqrt in findPixelDistance(Squared)

export const crow = (
  roadPixels: PixelData[],
  redPixels: PixelData[],
  bluePixels: PixelData[]
) => {
  if (!redPixels.length || !bluePixels.length) {
    return;
  }
  // Precompute the closest color for each roadPixel
  const closestColors = roadPixels.map((pixel: PixelData) => {
    let closestColor = 'red'; // Assume red is the closest color
    let squaredMinDistance = findPixelDistanceSquared(pixel, redPixels[0]);

    for (const redPixel of redPixels) {
      const squaredDistance = findPixelDistanceSquared(pixel, redPixel);
      if (squaredDistance < squaredMinDistance) {
        squaredMinDistance = squaredDistance;
        closestColor = 'red';
      }
    }

    for (const bluePixel of bluePixels) {
      const squaredDistance = findPixelDistanceSquared(pixel, bluePixel);
      if (squaredDistance < squaredMinDistance) {
        squaredMinDistance = squaredDistance;
        closestColor = 'blue';
      }
    }

    return closestColor;
  });

  // Map the closest colors to the corresponding roadPixels
  return roadPixels.map((pixel: PixelData, index: number) => {
    const closestColor = closestColors[index];
    return closestColor === 'red'
      ? {...redPixels[0], x: pixel.x, y: pixel.y}
      : {...bluePixels[0], x: pixel.x, y: pixel.y};
  });
};
