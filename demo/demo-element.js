import { LitElement, html, css } from 'lit';
import '../lit-weather';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

let typesDefData = `type Data = {
  name?: string;
  id?: number;
  sunrise?: string;
  sunset?: string;
  temp?: number;
  description?: string;
  humidity?: string;
  wind?: string;
  weatherImgSrc?: string;
  fullForecastUrl?: string;
  tempFeelsLike?: number;
}`;

let typesDefForecast = `type Forecast = {
  weekDayName: string;
  high: number;
  low: number;
  weatherImgSrc: string;
}[]`;

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

        <div class="mt-24">
          <h2 class="text-3xl mb-5">Properties</h2>
          <div class="my-6">
            <ul
              role="list"
              class="m-0 max-w-[calc(theme(maxWidth.lg)-theme(spacing.8))] list-none divide-y divide-zinc-900/5 p-0 dark:divide-white/5"
            >
              ${this.properties && this.properties.length > 0
                ? this.properties.map(
                    p => html`
                      <div class="m-0 px-0 py-4 first:pt-0 last:pb-0">
                        <dl class="m-0 flex flex-wrap items-center gap-x-3 gap-y-2">
                          <dt class="sr-only">Name</dt>
                          <dd>
                            <code>${p.name}</code>
                          </dd>

                          ${p.type.text
                            ? html`
                                <dt class="sr-only">Type</dt>
                                <dd class="font-mono text-xs text-zinc-400 dark:text-zinc-500">
                                  ${p.type.text}
                                </dd>
                              `
                            : ''}

                          <dt class="sr-only">Description</dt>
                          <dd
                            class="w-full !text-sm text-left flex-none text-gray-500 [&gt;:first-child]:mt-0 [&gt;:last-child]:mb-0"
                          >
                            ${unsafeHTML(p.description)}
                          </dd>
                        </dl>

                        ${p.name !== 'cn'
                          ? html`${p.default
                              ? html`
                                  <code class="whitespace-pre text-[10px] mt-4 block text-gray-500"
                                    >Default: ${p.default}</code
                                  >
                                `
                              : ''}`
                          : html`<button
                                id="${p.name}-button"
                                class="text-[10px] mt-3 text-gray-400 group"
                                @click="${() => {
                                  document.getElementById(p.name).classList.toggle('hidden');
                                  document
                                    .getElementById(p.name + '-button')
                                    .toggleAttribute('open');
                                }}"
                              >
                                <span class="group-open:hidden">View Default</span>
                                <span class="hidden group-open:block">Hide Default</span>
                              </button>
                              <div class="hidden" id="${p.name}">
                                ${p.default
                                  ? html`
                                      <code
                                        class="whitespace-pre text-[10px] mt-4 block text-gray-500"
                                        >${p.default}</code
                                      >
                                    `
                                  : ''}
                              </div>`}
                        ${p.typeDef
                          ? html`
                              <code class="whitespace-pre text-[10px] mt-4 block text-gray-500"
                                >${p.typeDef}</code
                              >
                            `
                          : ''}
                      </div>
                    `
                  )
                : html`<p>Loading...</p>`}
            </ul>
          </div>
        </div>

        <div class="mt-16 block text-xs text-gray-500">
          <a target="_blank" href="https://codepen.io/ryanburns23/pen/vYzgVLE">
            Edit on CodePen &rarr;
          </a>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      value: { type: String },
      properties: { type: Object },
    };
  }

  constructor() {
    super();
    this.value = 'Santa Barbara';
    fetch('/custom-elements.json').then(response => {
      response.json().then(json => {
        this.properties = json.modules[0].declarations[0].members
          .filter(m => m.kind === 'field' && m.type)
          .map(m => {
            const res = m;
            if (m.name === 'data') res.typeDef = typesDefData;
            if (m.name === 'forecast') res.typeDef = typesDefForecast;

            return res;
          });
        console.log(this.properties);
      });
    });
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
