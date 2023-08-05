export interface IUnit8ToArray {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
}

export const unit8ToArray = (
  uint8ClampedArray: Uint8ClampedArray,
  width: number,
  height: number
): IUnit8ToArray[][] => {
  if (uint8ClampedArray.length !== width * height * 4) {
    throw new Error(
      'The length of the Uint8ClampedArray does not match the given dimensions.'
    );
  }

  const result: IUnit8ToArray[][] = new Array(width);

  for (let x = 0; x < width; x++) {
    result[x] = new Array(height);
    for (let y = 0; y < height; y++) {
      const index = (y * width + x) * 4;
      const r = uint8ClampedArray[index];
      const g = uint8ClampedArray[index + 1];
      const b = uint8ClampedArray[index + 2];
      const a = uint8ClampedArray[index + 3];

      result[x][y] = {x, y, r, g, b, a};
    }
  }

  return result;
};
