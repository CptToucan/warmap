interface IUpdateCanvas {
  height: number;
  width: number;
  pixels: Uint8ClampedArray;
  ctx: CanvasRenderingContext2D;
}

export const updateCanvas = ({height, width, pixels, ctx}: IUpdateCanvas) => {
  const canvas = document.createElement('canvas');
  const ctx2 = canvas.getContext('2d');

  if (!ctx2) {
    throw new Error('Canvas context not supported');
  }

  const imageData = ctx2.createImageData(width, height);
  imageData.data.set(pixels);

  ctx.putImageData(imageData, 0, 0);
};
