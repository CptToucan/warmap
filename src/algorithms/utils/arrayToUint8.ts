import {IUint8ToArray} from './uint8ToArray';

interface IArrayToUint8 {
  width: number;
  height: number;
  pixels: IUint8ToArray[];
}

export const arrayToUint8 = ({width, height, pixels}: IArrayToUint8) => {
  const mergedPixels = new Uint8ClampedArray(width * height * 4).fill(255);

  for (let i = 0; i < pixels.length; i++) {
    const pixel = pixels[i];
    const x = pixel.x;
    const y = pixel.y;
    const index = (y * width + x) * 4;
    mergedPixels[index] = pixel.r;
    mergedPixels[index + 1] = pixel.g;
    mergedPixels[index + 2] = pixel.b;
    mergedPixels[index + 3] = 255; // Set alpha to 255 (fully opaque)
  }

  return mergedPixels;
};
