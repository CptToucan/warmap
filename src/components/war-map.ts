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

    const rect = new fabric.Rect({
      top: 100,
      left: 100,
      width: 60,
      height: 70,
      strokeWidth: 1,
      stroke: 'red',
      fill: 'rgba(0,0,0,0)',
    });

    fabric.Image.fromURL('../assets/map.jpg', function (map) {
      map.selectable = false;
      canvas.add(map);
      map.center();
      canvas.add(rect);
    });

    canvas.on('mouse:down', this.handleMouseDown);
  }
  render(): TemplateResult {
    return html`<div>
      <button @click="${this.handleClick}">Click me</button
      ><canvas id="canvas" styles="height: 100vh; width: 100vw"></canvas>
      <div></div>
    </div>`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleMouseDown(options: any) {
    const clickedObject = options.target;
    console.log(clickedObject);
  }

  handleClick() {
    console.log('click');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Get the image data from the canvas
    const imageData = ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const data = imageData.data;

    // Modify the pixel colors
    for (let i = 0; i < data.length; i += 4) {
      // Access the individual color channels (red, green, blue, alpha)
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      // Modify the color values (e.g., invert the colors)
      const invertedRed = 255 - red;
      const invertedGreen = 255 - green;
      const invertedBlue = 255 - blue;
      // Assign the modified color values back to the pixel
      data[i] = invertedRed;
      data[i + 1] = invertedGreen;
      data[i + 2] = invertedBlue;
    }

    // Put the modified image data back to the canvas
    ctx.putImageData(imageData, 0, 0);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'war-map': WarMap;
  }
}
