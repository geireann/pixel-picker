import { html, type TemplateResult } from 'lit';

export interface IntroModalProps {
  open: boolean;
  onDismiss: () => void;
}

export function renderIntroModalPresentation(props: IntroModalProps): TemplateResult {
  if (!props.open) return html``;

  return html`
    <div class="backdrop" @click=${(e: Event) => e.target === e.currentTarget && props.onDismiss()}>
      <div class="modal" role="dialog" aria-labelledby="modal-title">
        <h2 id="modal-title" class="title">PIXEL PICKER</h2>
        <p class="description">
          A real-time collaborative 256x256 board. Click any pixel to edit its color, letter, or number—or type directly on your keyboard to draw.
        </p>

        <button class="action-btn" @click=${props.onDismiss}>
          START
        </button>
      </div>
    </div>
  `;
}
