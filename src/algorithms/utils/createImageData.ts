interface ImageDataOptions {
  colorSpace: string;
  height: number;
  width: number;
  data: Uint8ClampedArray;
}

export const createImageData = ({
  height,
  width,
  data,
}: ImageDataOptions): ImageData => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not supported');
  }

  const imageData = ctx.createImageData(width, height);
  imageData.data.set(data);

  return imageData;
};
