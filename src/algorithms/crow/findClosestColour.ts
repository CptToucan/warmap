import {findPixelDistance} from './findPixelDistance';
import {PixelData} from './crow';

export const findClosestColour = (
  pixel: PixelData,
  redPixels: PixelData[],
  bluePixels: PixelData[]
) => {
  let closestColor = 'red'; // Assume red is the closest color
  let minDistance = findPixelDistance(pixel, redPixels[0]); // Initialize with distance to the first red pixel

  // Calculate distance to each red pixel
  for (const redPixel of redPixels) {
    const distance = findPixelDistance(pixel, redPixel);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = 'red';
    }
  }

  // Calculate distance to each blue pixel
  for (const bluePixel of bluePixels) {
    const distance = findPixelDistance(pixel, bluePixel);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = 'blue';
    }
  }

  return closestColor === 'red'
    ? {...redPixels[0], x: pixel.x, y: pixel.y}
    : {...bluePixels[0], x: pixel.x, y: pixel.y};
};
