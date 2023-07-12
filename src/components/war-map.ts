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
    return html` <canvas
      id="canvas"
      styles="height: 100vh; width: 100vw"
    ></canvas>`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleMouseDown(options: any) {
    const clickedObject = options.target;
    console.log(clickedObject);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'war-map': WarMap;
  }
}
