import {PixelData} from './crow';

export const findPixelDistanceSquared = (
  pixel1: PixelData,
  pixel2: PixelData
) => {
  const dX = pixel1.x - pixel2.x;
  const dY = pixel1.y - pixel2.y;
  return dX ** 2 + dY ** 2;
};
