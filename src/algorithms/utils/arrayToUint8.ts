import {twoDArrayConvertType} from './unit8ToArray';

interface arrayToUint8Type {
  width: number;
  height: number;
  pixels: twoDArrayConvertType[];
}

export const arrayToUint8 = ({width, height, pixels}: arrayToUint8Type) => {
  const mergedPixels = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < mergedPixels.length; i += 4) {
    mergedPixels[i] = 0;
    mergedPixels[i + 1] = 0;
    mergedPixels[i + 2] = 0;
    mergedPixels[i + 3] = 255; // Set alpha to 255 (fully opaque)
  }

  for (const pixel of pixels) {
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