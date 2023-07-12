import {css, html, LitElement, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('war-map')
export class WarMap extends LitElement {
  static get styles() {
    return css`
      h1 {
        font-size: var(--lumo-font-size-l);
        margin: var(--lumo-space-m);
      }
    `;
  }
  render(): TemplateResult {
    return html`
      <h1>WarMap</h1>
      <canvas></canvas>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'war-map': WarMap;
  }
}
