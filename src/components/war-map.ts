import {css, html, LitElement, TemplateResult} from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {customElement, query} from 'lit/decorators.js';
import {fabric} from 'fabric';
import {arrayToUint8, uint8ToArray, updateCanvas} from '../algorithms/utils';
import {bounding} from '../algorithms/bounding/bounding';
// import {crow} from '../algorithms/crow';
// import {bounding} from '../algorithms/bounding';

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
      strokeWidth: 2,
      stroke: 'red',
      fill: 'rgba(0,0,0,0)',
    });

    const red2 = new fabric.Rect({
      top: 400,
      left: 400,
      width: 60,
      height: 70,
      strokeWidth: 2,
      stroke: 'red',
      fill: 'rgba(0,0,0,0)',
    });

    const blue = new fabric.Rect({
      top: 200,
      left: 200,
      width: 60,
      height: 70,
      strokeWidth: 2,
      stroke: 'blue',
      fill: 'rgba(0,0,0,0)',
    });

    const blue2 = new fabric.Rect({
      top: 200,
      left: 700,
      width: 60,
      height: 70,
      strokeWidth: 2,
      stroke: 'blue',
      fill: 'rgba(0,0,0,0)',
    });

    fabric.Image.fromURL(
      '../assets/Cyrus/_3x3_Cyrus_Yellow_noBackground.png',
      function (map) {
        map.selectable = false;
        canvas.add(map);
        canvas.add(red);
        canvas.add(red2);
        canvas.add(blue);
        canvas.add(blue2);
      }
    );
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

    console.log('imageData', imageData);

    const array2dPixelData = uint8ToArray(
      imageData.data,
      this.canvas.width,
      this.canvas.height
    );

    console.log('array2dPixelData', array2dPixelData);

    const redColour = [255, 0, 0];
    const blueColour = [0, 0, 255];
    for (let x = 0; x < this.canvas.width; x++) {
      for (let y = 0; y < this.canvas.height; y++) {
        const colourData = [
          array2dPixelData[x][y].r,
          array2dPixelData[x][y].g,
          array2dPixelData[x][y].b,
        ];

        if (
          array2dPixelData[x][y].r !== 0 ||
          array2dPixelData[x][y].g !== 0 ||
          array2dPixelData[x][y].b !== 0
        ) {
          switch (true) {
            case isRGBAColor(colourData, redColour):
              redPixels.push(array2dPixelData[x][y]);
              break;
            case isRGBAColor(colourData, blueColour):
              bluePixels.push(array2dPixelData[x][y]);
              break;
            default:
              roadPixels.push(array2dPixelData[x][y]);
              break;
          }
        }
      }
    }

    console.log('redPixels', redPixels);
    console.log('bluePixels', bluePixels);
    console.log('roadPixels', roadPixels);

    // const updatedRoadPixels = crow(roadPixels, redPixels, bluePixels);

    const updatedRoadPixels = bounding(roadPixels, redPixels, bluePixels);

    const mergedPixels = arrayToUint8({
      height: this.canvas.height,
      width: this.canvas.width,

      pixels: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(updatedRoadPixels as any[]),
        ...redPixels,
        ...bluePixels,
      ],
    });

    // Put the modified image data back to the canvas
    updateCanvas({
      height: this.canvas.height,
      width: this.canvas.width,
      pixels: mergedPixels,
      ctx,
    });
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRGBAColor(rgbaValue: any, targetColor: any, tolerance = 40) {
  const [r1, g1, b1] = rgbaValue;
  const [r2, g2, b2] = targetColor;

  const rDiff = Math.abs(r1 - r2);
  const gDiff = Math.abs(g1 - g2);
  const bDiff = Math.abs(b1 - b2);

  return rDiff <= tolerance && gDiff <= tolerance && bDiff <= tolerance;
}

declare global {
  interface HTMLElementTagNameMap {
    'war-map': WarMap;
  }
}
