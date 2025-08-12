class MDialog extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const dialog = document.createElement('div');

    dialog.innerHTML = `
      <div class="backdrop">
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `

    this.backdrop = dialog.querySelector('.backdrop');

    dialog.addEventListener('open', () => {
      backdrop.style.display = 'block';
    })

    dialog.addEventListener('close', () => {
      backdrop.style.display = 'none';
    })

    const style = document.createElement('style');
    style.textContent = `
      .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
        z-index: 1000;
      }
      .content {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: block;
      }
    `

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(dialog);
  }

  open() {
    console.log('open')
    this.backdrop.style.display = 'block';
  }

  close() {
    this.backdrop.style.display = 'none'
  }
}

customElements.define('m-dialog', MDialog);
