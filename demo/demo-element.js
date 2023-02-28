import { LitElement, html } from 'lit';
import '../lit-weather';

const defaultTabClassName = /*tw*/ 'rounded-md px-3 py-2 text-sm font-medium';
const activeTabClassName =
  /*tw*/ 'bg-gray-50/50 dark:bg-white/10 dark:text-white text-black rounded-md px-3 py-2 text-sm font-medium';
class DemoElement extends LitElement {
  render() {
    return html`
      <style>
        :host {
          display: block;
        }

        a {
          text-decoration: underline;
        }
      </style>

      <div class="max-w-2xl mx-auto">
        <div class="gap-x-4 mb-10">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">lit-weather</h2>
          <p class="mx-auto mt-6 text-lg leading-8 dark:text-gray-300 text-gray-600">
            <a target="_blank" href="https://lit.dev" class="text-underline">Lit</a> powered weather
            forecast
            <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components">web component</a>,
            leveraging the <a href="https://openweathermap.org/">OpenWeatherMap</a> API. It's
            customizable with <a href="https://tailwindcss.com/">tailwindcss</a>,
            <a href="https://bundlephobia.com/package/lit-weather">lightweight</a>, and shadow dom
            free.
          </p>
        </div>

        <nav
          class="inline-flex items-center justify-center bg-white rounded-md bg-gray-200/50 dark:bg-white/5 p-1 mb-10 text-gray-700 dark:text-gray-300"
        >
          <button
            id="santa-barbara"
            @click="${() => {
              this.value = 'Santa Barbara';
              this.refresh();
            }}"
            class="${this.value === 'Santa Barbara' ? activeTabClassName : defaultTabClassName}"
          >
            Santa Barbara
          </button>
          <button
            id="sydney"
            @click="${() => {
              this.value = 'Sydney, Australia';
              this.refresh();
            }}"
            class="${this.value === 'Sydney, Australia' ? activeTabClassName : defaultTabClassName}"
          >
            Sydney, Australia
          </button>
          <button
            id="90210"
            @click="${() => {
              this.value = '90210';
              this.refresh();
            }}"
            class="${this.value === '90210' ? activeTabClassName : defaultTabClassName}"
          >
            90210
          </button>
          <button
            id="california"
            @click="${() => {
              this.value = 'California';
              this.refresh();
            }}"
            class="${this.value === 'California' ? activeTabClassName : defaultTabClassName}"
          >
            California
          </button>
        </nav>

        <lit-weather
          class="block"
          .query="${this.value}"
          token="1e366c8dec8ecdfd589dd13d8aa454e2"
        ></lit-weather>
      </div>
    `;
  }

  static get properties() {
    return {
      value: { type: String },
    };
  }

  constructor() {
    super();
    this.value = 'Santa Barbara';
  }
  refresh() {
    this.requestUpdate();
    console.log(this.value);
    document.querySelector('lit-weather').query = this.value;
    document.querySelector('lit-weather').refresh();
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('demo-element', DemoElement);
