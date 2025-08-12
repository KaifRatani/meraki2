class MPagination extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .pagination {
          font-weight: 500;
          font-size: 18px;
          line-height: 35px;
          color: #726E66;
          text-align: center;
          margin-top: 32px;
        }

        .pagination p {
          margin: 0;
          margin-bottom: 12px;
        }

        .pagination a {
          font-weight: 500;
          font-size: 18px;
          line-height: 35px;
          color: #074264;
          text-decoration: none;
          padding: 0 16px;
        }

        .pagination a:hover {
          color: #6A131F;
        }

        .pagination .active {
          font-weight: 700;
        }
      </style>
      <div class="pagination">
        <p>Page 1 of 10</p>
        <a href="#" class="active">1</a>
        <a href="#">2</a>
        <a href="#">3</a>
        <a href="#">4</a>
        <a href="#">5</a>
        <a href="#">6</a>
        <a href="#">7</a>
        <a href="#">8</a>
        <a href="#">9</a>
        <a href="#">10</a>
      </div>
    `;
  }
}

customElements.define('m-pagination', MPagination);
