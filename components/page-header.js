export const template = () => /*html*/`
  <style>
    .page-header {
      position: relative;
      padding-bottom: 8px;
    }
    .page-header::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      border-bottom: 1px solid #000;
    }
    .road {
      position: absolute;
      left: 15em;
      right: 2em;
      bottom: 0;
    }
    .hours {
      position: absolute;
      width: 16px;
      height: 16px;
      left: 0;
      bottom: 0;
      animation: horseMove 60s linear infinite;
    }
    .hours::before {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      background: center/contain url("${basePath}/assets/images/hours.png");
      animation: horseShake .5s linear infinite alternate;
    }
    .page-header ul{
      list-style-type: none;
      padding: 0;
      margin: 0;
      font-family: Monospace;
      font-size: 32px;
      font-weight: bolder;
    }
    .page-header a {
      color: #000!important;
      text-decoration: none!important;
    }
    @keyframes horseMove {
      0% {
        left: 0;
        transform: scaleX(-1);
      }
      49.99% {
        transform: scaleX(-1);
      }
      50% {
        left: 100%;
        transform: scaleX(1);
      }
      99.99% {
        transform: scaleX(1);
      }
      100% {
        left: 0;
        transform: scaleX(-1);
      }
    }
    @keyframes horseShake {
      0% {
        transform: rotate(-10deg);
      }
      100% {
        transform: rotate(10deg);
      }
    }
  </style>
  <header class="page-header">
    <ul>
      <li><a href="${basePath}/">Playground</a></li>
    </ul>
    <div class="road"><div class="hours"></div></div>
  </header>
`;

export class PageHeader extends HTMLElement {
  constructor() {
      super();
      // const shadowRoot = this.attachShadow({ mode: 'open' });
      // shadowRoot.appendChild(template.cloneNode(true));
      this.innerHTML = template()
  }
}

export function install() {
  window.customElements.define('page-header', PageHeader);
}

export default install;