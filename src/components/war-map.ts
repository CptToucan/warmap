import {css, html, LitElement, TemplateResult} from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {customElement, query} from 'lit/decorators.js';
import {fabric} from 'fabric';
import {createImageData, unit8ToArray, arrayToUint8} from '../algorithms/utils';
import {crow} from '../algorithms/crow';

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

    const red2 = new fabric.Rect({
      top: 400,
      left: 400,
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

    const blue2 = new fabric.Rect({
      top: 200,
      left: 700,
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
      canvas.add(red2);
      canvas.add(blue);
      canvas.add(blue2);
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

    const array2dPixelData = unit8ToArray(
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

    const updatedRoadPixels = crow(roadPixels, redPixels, bluePixels);

    const mergedPixels = arrayToUint8({
      height: this.canvas.height,
      width: this.canvas.width,
      pixels: [...updatedRoadPixels, ...redPixels, ...bluePixels],
    });

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

declare global {
  interface HTMLElementTagNameMap {
    'war-map': WarMap;
  }
}
