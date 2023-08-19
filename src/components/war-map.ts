import {css, html, LitElement, TemplateResult} from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {customElement, query} from 'lit/decorators.js';
import {fabric} from 'fabric';
import {uint8ToArray, arrayToUint8, updateCanvas} from '../algorithms/utils';
import {crow} from '../algorithms/crow';
// import {bounding} from '../algorithms/bounding';
import {isRGBAColor} from '../algorithms/utils/isRGBColour';

@customElement('war-map')
export class WarMap extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        height: 100%;
        width: 100%;
      }
      canvas {
        height: 100vh;
        width: 100vw;
      }
    `;
  }

  @query('canvas')
  private canvas!: HTMLCanvasElement;
  private fabricCanvas?: fabric.Canvas | undefined;

  firstUpdated() {
    const canvas = new fabric.Canvas(this.canvas, {
      preserveObjectStacking: true,
      width: 1920,
      height: 1080,
    });

    this.fabricCanvas = canvas;

    fabric.Image.fromURL('../assets/map.jpg', function (map) {
      map.selectable = false;
      canvas.add(map);
    });
  }

  render(): TemplateResult {
    return html`<div>
      <canvas id="canvas"></canvas>
      <button @click="${this.handleClick}">Click me</button>
      <button @click="${this.handleAddBlue}">Add Blue Spawn</button>
      <button @click="${this.handleAddRed}">Add Red Spawn</button>
    </div>`;
  }

  handleAddBlue() {
    const newRect = new fabric.Rect({
      top: 300,
      left: 300,
      width: 70,
      height: 70,
      strokeWidth: 2,
      stroke: 'blue',
      fill: 'rgba(0,0,0,0)',
    });
    this?.fabricCanvas?.add(newRect);
  }

  handleAddRed() {
    const newRect = new fabric.Rect({
      top: 300,
      left: 600,
      width: 70,
      height: 70,
      strokeWidth: 2,
      stroke: 'red',
      fill: 'rgba(0,0,0,0)',
    });
    this?.fabricCanvas?.add(newRect);
  }

  handleClick() {
    const ctx = this.canvas.getContext('2d');
    if (!ctx || !this.fabricCanvas) {
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

    const array2dPixelData = uint8ToArray(
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

    // const updatedRoadPixels = bounding(roadPixels, redPixels, bluePixels);

    const mergedPixels = arrayToUint8({
      height: this.canvas.height,
      width: this.canvas.width,
      // pixels: [...updatedRoadPixels, ...redPixels, ...bluePixels],
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

declare global {
  interface HTMLElementTagNameMap {
    'war-map': WarMap;
  }
}
