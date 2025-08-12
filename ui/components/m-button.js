class MButton extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const button = document.createElement('button');
    button.textContent = this.textContent;

    const autoWidth = this.hasAttribute('auto-width');

    const style = document.createElement('style');
    const sharedStyles = `
      button {
        min-height: 45px;
        min-width: 144px;
        border-radius: 5px;
        font-weight: 600;
        font-size: 16px;
        line-height: 100%;
        text-align: center;
        cursor: pointer;
        border: none;
        color: #FEFEFEFE;
        padding: 0.05px;

        ${ autoWidth ? 'width: auto; min-width: 0' : '' }
      }

      button:disabled {
        cursor: not-allowed;
        pointer-events: none;
      }
    `;

    this.variant = this.getAttribute('variant') || 'default';
    button.disabled = this.hasAttribute('disabled');

    button.setAttribute('aria-disabled', button.disabled);

    button.innerHTML = `
      <slot></slot>
    `

    if (this.variant === 'primary') {
      style.textContent = `${sharedStyles}
        button {
          background-color: #1C5A79;
          box-shadow: 2px 4px 4px 0px #0223351F;
        }

        button:disabled {
          background-color: #C3CFD9;
          color: #04273C;
          box-shadow: 2px 4px 4px 0px #0223351F;
        }

        button:hover {
          background-color: #074264;
        }

        button:active {
          background-color: #04273C;
        }
      `;
    } else if (this.variant === 'secondary') {
      style.textContent = `${sharedStyles}
        button {
          background-color: #B8162F;
        }

        button:disabled {
          background-color: #E94141;
        }

        button:hover {
          background-color: #85051D;

        }

        button:active {
          background-color: #4C010FE5;
        }
      `;
    } else if (this.variant === 'ghost') {
      style.textContent = `${sharedStyles}
        button {
          background-color: transparent;
          color: white;
          border: 1px solid white;
          min-height: 32px;
          min-width: unset;
          padding-inline: 0.5em;
        }
      `;
    } else {
      style.textContent = `${sharedStyles}
        button {
          background-color: white;
          color: #1C5A79;
          border: 2px solid #1C5A79;
          box-shadow: 2px 4px 4px 0px #0223351F;
        }

        button:disabled {
          background-color: #C3CFD9;
          color: #1C5A79;
        }

        button:hover {
          color: #FEFEFEFE;
          background-color: #1C5A79;
        }

        button:active {
          background-color: #074264;
        }
      `;
    }

    shadow.appendChild(style);
    shadow.appendChild(button);
  }
}

customElements.define('m-button', MButton);
