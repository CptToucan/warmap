import {css, html, LitElement, TemplateResult} from 'lit';
import {customElement, query} from 'lit/decorators.js';
import {fabric} from 'fabric';

@customElement('war-map')
export class WarMap extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        height: 100%;
        width: 100%;
      }
      h1 {
        font-size: var(--lumo-font-size-l);
        margin: var(--lumo-space-m);
      }

      canvas {
        height: 100vh;
        width: 100vw;
      }
    `;
  }

  @query('canvas')
  private canvas!: HTMLCanvasElement;

  firstUpdated() {
    const canvas = new fabric.Canvas(this.canvas, {
      preserveObjectStacking: true,
      width: 1920,
      height: 1080,
    });

    const red = new fabric.Rect({
      top: 100,
      left: 100,
      width: 60,
      height: 70,
      strokeWidth: 1,
      stroke: 'red',
      fill: 'rgba(0,0,0,0)',
    });

    const blue = new fabric.Rect({
      top: 200,
      left: 200,
      width: 60,
      height: 70,
      strokeWidth: 1,
      stroke: 'blue',
      fill: 'rgba(0,0,0,0)',
    });

    fabric.Image.fromURL('../assets/map.jpg', function (map) {
      map.selectable = false;
      canvas.add(map);
      canvas.add(red);
      canvas.add(blue);
    });
  }
  render(): TemplateResult {
    return html`<div>
      <canvas id="canvas"></canvas>
      <button @click="${this.handleClick}">Click me</button>
    </div>`;
  }

  handleClick() {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    const roadPixels = [];
    const redPixels = [];
    const bluePixels = [];

    // Get the image data from the canvas
    const imageData = ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    const array2dPixelData = convertTo2DArray(
      imageData.data,
      this.canvas.width,
      this.canvas.height
    );

    const redColour = [255, 0, 0];
    const blueColour = [0, 0, 255];
    const roadColour = [140, 135, 1];
    for (let x = 0; x < this.canvas.width; x++) {
      for (let y = 0; y < this.canvas.height; y++) {
        const colourData = [
          array2dPixelData[x][y].r,
          array2dPixelData[x][y].g,
          array2dPixelData[x][y].b,
        ];

        switch (true) {
          case isRGBAColor(colourData, redColour):
            redPixels.push(array2dPixelData[x][y]);
            break;
          case isRGBAColor(colourData, blueColour):
            bluePixels.push(array2dPixelData[x][y]);
            break;
          case isRGBAColor(colourData, roadColour):
            roadPixels.push(array2dPixelData[x][y]);
            break;
        }
      }
    }

    const updatedRoadPixels = findClosestColor(
      roadPixels,
      redPixels,
      bluePixels
    );

    const mergedPixels = new Uint8ClampedArray(
      this.canvas.width * this.canvas.height * 4
    );

    for (let i = 0; i < mergedPixels.length; i += 4) {
      mergedPixels[i] = 0;
      mergedPixels[i + 1] = 0;
      mergedPixels[i + 2] = 0;
      mergedPixels[i + 3] = 255; // Set alpha to 255 (fully opaque)
    }

    for (const pixel of [...updatedRoadPixels, ...redPixels, ...bluePixels]) {
      const x = pixel.x;
      const y = pixel.y;
      const index = (y * this.canvas.width + x) * 4;
      mergedPixels[index] = pixel.r;
      mergedPixels[index + 1] = pixel.g;
      mergedPixels[index + 2] = pixel.b;
      mergedPixels[index + 3] = 255; // Set alpha to 255 (fully opaque)
    }

    // Put the modified image data back to the canvas
    const imageOptions = {
      colorSpace: 'srgb',
      height: this.canvas.height,
      width: this.canvas.width,
      data: mergedPixels,
    };

    const newImageData = createImageData(imageOptions);
    ctx.putImageData(newImageData, 0, 0);
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRGBAColor(rgbaValue: any, targetColor: any, tolerance = 40) {
  const [r1, g1, b1, a1 = 1] = rgbaValue;
  const [r2, g2, b2, a2 = 1] = targetColor;

  const rDiff = Math.abs(r1 - r2);
  const gDiff = Math.abs(g1 - g2);
  const bDiff = Math.abs(b1 - b2);
  const aDiff = Math.abs(a1 - a2);

  return (
    rDiff <= tolerance &&
    gDiff <= tolerance &&
    bDiff <= tolerance &&
    aDiff <= tolerance
  );
}

type twodArrayConvertType = {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
};

function convertTo2DArray(
  uint8ClampedArray: Uint8ClampedArray,
  width: number,
  height: number
): twodArrayConvertType[][] {
  if (uint8ClampedArray.length !== width * height * 4) {
    throw new Error(
      'The length of the Uint8ClampedArray does not match the given dimensions.'
    );
  }

  const result: twodArrayConvertType[][] = new Array(width);

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
}

function findClosestColor(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roadPixels: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redPixels: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bluePixels: any[]
) {
  // Helper function to calculate the distance between two pixels
  function pixelDistance(
    pixel1: {x: number; y: number; r: number; g: number; b: number},
    pixel2: {x: number; y: number; r: number; g: number; b: number}
  ) {
    const dX = pixel1.x - pixel2.x;
    const dY = pixel1.y - pixel2.y;
    const colorDistance = Math.sqrt(
      (pixel1.r - pixel2.r) ** 2 +
        (pixel1.g - pixel2.g) ** 2 +
        (pixel1.b - pixel2.b) ** 2
    );
    return Math.sqrt(dX ** 2 + dY ** 2 + colorDistance ** 2);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getClosestColor(roadPixel: any) {
    let closestColor = 'red'; // Assume red is the closest color
    let minDistance = pixelDistance(roadPixel, redPixels[0]); // Initialize with distance to the first red pixel

    // Calculate distance to each red pixel
    for (const redPixel of redPixels) {
      const distance = pixelDistance(roadPixel, redPixel);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = 'red';
      }
    }

    // Calculate distance to each blue pixel
    for (const bluePixel of bluePixels) {
      const distance = pixelDistance(roadPixel, bluePixel);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = 'blue';
      }
    }

    return closestColor === 'red'
      ? {...redPixels[0], x: roadPixel.x, y: roadPixel.y} // Create a copy of the closest red pixel
      : {...bluePixels[0], x: roadPixel.x, y: roadPixel.y}; // Create a copy of the closest blue pixel
  }

  // Create a new array of updated roadPixels
  const updatedRoadPixels = roadPixels.map(getClosestColor);
  return updatedRoadPixels;
}

interface ImageDataOptions {
  colorSpace: string;
  height: number;
  width: number;
  data: Uint8ClampedArray;
}

function createImageData({height, width, data}: ImageDataOptions): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not supported');
  }

  // Create an ImageData object
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(data);

  return imageData;
}

declare global {
  interface HTMLElementTagNameMap {
    'war-map': WarMap;
  }
}
