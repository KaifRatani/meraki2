import './m-button.js';


class HeaderDropdown extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' })

    const dropdown = document.createElement('div')
    dropdown.classList.add('dropdown')

    dropdown.innerHTML = `
      <div class=container>
        <slot></slot>
      </div>
    `
    const style = document.createElement('style');

    style.textContent = `
      :host {
        position: relative;
      }
      .dropdown {
        position: absolute;
        top: 0;
        right: -100px;
        padding-top: 12px;
      }
      .container {
        background-color: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding: 8px;
      }
    `

    shadow.appendChild(style);
    shadow.appendChild(dropdown);
  }
}

customElements.define('header-dropdown', HeaderDropdown);

class AuthedDropdown extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' })

    const dropdown = document.createElement('div')
    const user = JSON.parse(localStorage.getItem('user'))

    dropdown.innerHTML = `
      <header-dropdown>
        <div class="user-info-container">
          <div class="user-info">
            <img src="${user.avatar}" alt="Avatar" />
            <p>${user.name}</p>
          </div>
        
          </div>
      </header-dropdown>
    `;

    const style = document.createElement('style');
    style.textContent = `
      a {
        display: block;
        text-decoration: none;
        color: #074264;
        font-size: 20px;
        padding-block: 4px;
        font-weight: 600;
      }
      .user-info-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
      }
      .user-info {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .user-info img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        flex: 0 0 24px;
      }
      .user-info p {
        flex: 1 1 0; 
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dropdown-items {
        margin-top: 4px;
      }
      .dropdown-items a {
        white-space: nowrap;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(dropdown);
  }
}

customElements.define('authed-dropdown', AuthedDropdown);

class UnauthedDropdown extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' })

    const dropdown = document.createElement('div')

    dropdown.innerHTML = `
      <header-dropdown>
        <a href="loginForm.html">Login</a>
        <a href="signinForm.html">Register</a>
      </header-dropdown>
    `;

    const style = document.createElement('style');
    style.textContent = `
      a {
        display: block;
        padding: 8px 16px;
        text-decoration: none;
        color: #074264;
        font-size: 20px;
        font-weight: 600;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(dropdown);
  }
}

customElements.define('unauthed-dropdown', UnauthedDropdown);

class MHamburger extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const hamburger = document.createElement('div');
    hamburger.classList.add('hamburger');
    hamburger.innerHTML = `
      <div class="stripe stripe-1"></div>
      <div class="stripe stripe-2"></div>
      <div class="stripe stripe-3"></div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .hamburger {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      
      .hamburger.active .stripe-1 {
        animation: kf-stripe-1 0.6s;
        animation-fill-mode: both;
      }
      
      .hamburger.active .stripe-2 {
        animation: kf-stripe-2 0.6s;
        animation-fill-mode: both;
      }
      
      .hamburger.active .stripe-3 {
        animation: kf-stripe-3 0.6s;
        animation-fill-mode: both;
      }
      
      .hamburger.unactive .stripe-1 {
        animation: kf-stripe-rev-1 0.6s;
        animation-fill-mode: both;
      }

      .hamburger.unactive .stripe-2 {
        animation: kf-stripe-rev-2 0.6s;
        animation-fill-mode: both;
      }
      
      .hamburger.unactive .stripe-3 {
        animation: kf-stripe-rev-3 0.6s;
        animation-fill-mode: both;
      }

      .hamburger .stripe {
        background-color: white;
        width: 32px;
        height: 4px;
        border-radius: 2px;
      }

      @keyframes kf-stripe-1 {
        0% {
          transform: translateY(0);
        }
        
        50% {
          transform: translateY(10px);
        }
        
        100% {
          transform: translateY(10px) rotate(45deg);
        }
      }

      @keyframes kf-stripe-2 {
        0% {
          transform: scale(1);
        }
        
        100% {
          transform: scale(0);
        }
      }

      @keyframes kf-stripe-3 {
        0% {
          transform: translateY(0);
        }
        
        50% {
          transform: translateY(-10px);
        }
        
        100% {
          transform: translateY(-10px) rotate(135deg);
        }
      }

      @keyframes kf-stripe-rev-1 {
        1000% {
          transform: translateY(0);
        }
        
        50% {
          transform: translateY(10px);
        }
        
        0% {
          transform: translateY(10px) rotate(45deg);
        }
      }

      @keyframes kf-stripe-rev-2 {
        100% {
          transform: scale(1);
        }
        
        0% {
          transform: scale(0);
        }
      }

      @keyframes kf-stripe-rev-3 {
        100% {
          transform: translateY(0);
        }
        
        50% {
          transform: translateY(-10px);
        }
        
        0% {
          transform: translateY(-10px) rotate(135deg);
        }
      }
    `;

    hamburger.addEventListener('click', () => {
      if (hamburger.classList.contains('active')) {
        hamburger.classList.add('unactive')
        hamburger.classList.remove('active')
      } else {
        hamburger.classList.add('active')
        hamburger.classList.remove('unactive')
      }
    })

    shadow.appendChild(style);
    shadow.appendChild(hamburger);
  }
}

customElements.define('m-hamburger', MHamburger);

class MHeader extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const active = this.getAttribute('active');

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    console.log(localStorage.getItem('user'), 'render')

    const header = document.createElement('header');
    header.innerHTML = `
      <ul>
        <li class="logo">
          <a href="/">
            <img class="logo-img" src="images/logo/langscape_logo_text.png" alt="Logo" />
          </a>
        </li>
        <menu>
          <li>
            <a data-text="Home" href="/" ${active === 'home' ? 'class="active"' : ''}>Home</a>
          </li>
          <li>
            <a data-text="Programs" href="/programs.html" ${active === 'programs' ? 'class="active"' : ''}>Programs</a>
          </li>
          <li>
            <a data-text="Get Involved" href="/get-involved.html" ${active === 'get-involved' ? 'class="active"' : ''}>Get Involved</a>
          </li>
          <li>
            <a data-text="Events" href="/events.html" ${active === 'events' ? 'class="active"' : ''}>Events</a>
          </li>
          <li>
            <a data-text="News" href="/news.html" ${active === 'news' ? 'class="active"' : ''}>News</a>
          </li>
          <li>
            <a data-text="Contact" href="/contact.html" ${active === 'contact' ? 'class="active"' : ''}>Contact</a>
          </li>
          <li>
            <a data-text="About Us" href="/about-us.html" ${active === 'about-us' ? 'class="active"' : ''}>About Us</a>
          </li>
        </menu>
        <li>
          <m-button class="hamburger-button" variant="primary" auto-width>
            <div style="padding: 12px">
              <m-hamburger class="hamburger-button"/>
            </div>
          </m-button>
        </li>
        <li>
          <m-button
            variant="secondary"
            onclick="window.open('https://www.zeffy.com/en-US/fundraising/c95056db-d06b-407f-b4ba-5de61442d2e4', '_blank', 'noopener')"
            style="margin-right: 12px;"
            auto-width
          >
            <div style="margin-inline: 24px;">Donate</div>
          </m-button>
        </li>
        <li>
          <div class="auth-dropdown">
            <m-button auto-width id="sign-in-button">
              ${user
                ? `<div class="auth-button">
                      <img src="${user.avatar}" alt="Avatar" />
                      <p>${user.name}</p>
                    </div>`
                : `<div style="margin-inline: 24px">Sign In</div>`}
            </m-button>

            ${user ? '<authed-dropdown />' : '<unauthed-dropdown />'}
          </div>
        </li>
      </ul>
    `;
    const style = document.createElement('style');
    style.textContent = `
      header {
        background-color: #FEFEFEFE;
        border-bottom: 1px solid #d9d9d9;
        position: sticky;
        top: 0;
        z-index: 100;
      }
      ul {
        padding: 0 256px;
        height: 124px;
        display: flex;
        align-items: center;
        position: relative;
      }
      li {
        list-style: none;
      }
      menu {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 64px;
        padding-inline-start: 0;
      }
      menu li {
        list-style: none;
        text-align: center;
      }
      .hamburger-button {
        display: none;
      }
      menu a:before {
        content: attr(data-text);
        color: transparent;
        display: block;
        font-weight: 800;
        height: 0;
      }
      menu a {
        text-decoration: none;
        font-weight: 600;
        font-size: 20px;
        color: #074264;
        height: 32px;
        line-height: 32px;
        display: block;
        text-transform: uppercase;
      }
      menu a:hover {
        font-weight: 800;
      }
      menu a.active {
        color: #6A131F;
      }
      menu a.active:hover {
        color: #6A131F;
        font-weight: 600;
      }
      ul {
        margin: 0;
      }
      ul>li:nth-last-child(3) {
        margin-left: auto;
        margin-right: 12px;
      }
      ul>li:last-child {
        margin-right: 44px;
      }
      .logo {
        display: flex;
        align-items: center;
        margin-right: 72px;
      }
      .logo-img {
        height: 48px;
      }
      .auth-dropdown {
        position: relative;
      }
      .auth-dropdown unauthed-dropdown {
        display: none;
      }
      .auth-dropdown authed-dropdown {
        display: none;
      }
      .auth-dropdown:hover unauthed-dropdown {
        display: block;
      }
      .auth-dropdown:hover authed-dropdown {
        display: block;
      }
      .auth-button {
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 94px;
        gap: 8px;
        overflow: hidden;
        margin-inline: 24px
      }
      .auth-button img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        flex: 0 0 24px;
      }
      .auth-button p {
        flex: 1 1 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0;
      }
      m-button > * {
        font-size: 20px;
      }
      @media (max-width: 2148px) {
        ul {
          box-sizing: border-box;
          width: 100%;
          padding: 0 0 0 32px;
        }
        menu {
          position: absolute;
          top: 124px;
          left: 0;
          right: 0;
          z-index: 100;
          flex-direction: column;
          background-color: #fff;
          align-items: stretch;
          gap: 0;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-in-out;
        }
        menu.active {
          max-height: 500px;
        }
        menu li {
          height: 64px;
          line-height: 64px;
        }
        menu li+li {
          border-top: 1px solid #d9d9d9;
        }
        menu a {
          line-height: 64px;
        }
        .hamburger-button {
          display: block;
        }
      }
    `;
    const hamburgerButton = header.querySelector('.hamburger-button');
    hamburgerButton.addEventListener('click', () => {
      const menu = header.querySelector('menu');
      menu.classList.toggle('active');
    })
    shadow.appendChild(style);
    shadow.appendChild(header);
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#sign-in-button').onclick = () => {
    if (localStorage.getItem('user')) {
  localStorage.removeItem('user');
} else {
  // Temporarily use email placeholder if not integrating backend yet
  const email = localStorage.getItem('loginEmail') || 'user@example.com';
localStorage.setItem('user', JSON.stringify({
  avatar: 'images/logo/logo.png',
  name: email
}));

}

      setTimeout(() => location.reload(), 1000)
    }
  }
}

customElements.define('m-header', MHeader);
