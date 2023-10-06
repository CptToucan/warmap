export const isRGBAColor = (
  rgbaValue: number[],
  targetColor: number[],
  tolerance = 40
) => {
  const [r1, g1, b1] = rgbaValue;
  const [r2, g2, b2] = targetColor;

  const rDiff = Math.abs(r1 - r2);
  const gDiff = Math.abs(g1 - g2);
  const bDiff = Math.abs(b1 - b2);

  return rDiff <= tolerance && gDiff <= tolerance && bDiff <= tolerance;
};
