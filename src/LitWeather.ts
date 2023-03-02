import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

function getLocalTime(time: Date) {
  return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

function getWeekDay(index: number) {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index];
}

const Skelton = {
  lg: html`<div class="h-5 w-48 bg-gray-50 dark:bg-gray-700 rounded-lg mb-3"></div>`,
  md: html`<div class="h-4 w-20 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2"></div>`,
  sm: html`<div class="h-3 w-8 bg-gray-50 dark:bg-gray-800 rounded-lg mb-1"></div>`,
};

const grayTxt = /*tw*/ 'text-gray-500 dark:text-gray-400';
const defaultCn = /*tw*/ {
  wrapper: 'block',
  location: 'text-2xl font-medium',
  today: `text-base ${grayTxt}`,
  description: `text-sm mb-3 capitalize ${grayTxt}`,
  time: `text-base mb-4 ${grayTxt}`,
  img: 'h-[70px] w-[70px] mr-3 bg-inherit rounded',
  'img-loading': 'h-[70px] w-[70px] bg-gray-50 dark:bg-gray-800 mr-3 bg-inherit rounded',
  'extra-info': `flex-col text-xs ml-6 mt-2 hidden sm:flex ${grayTxt}`,
  'temp-wrapper': 'flex horizontal',
  'temp-content': 'flex',
  temp: 'text-7xl',
  'unit-toggle': `text-lg mt-1.5 ml-2 ${grayTxt}`,
  'unit-toggle-active': `text-black dark:text-white`,
  'forecast-wrapper': 'flex flex-wrap gap-6 sm:gap-8 mt-4',
  'forecast-item': 'flex flex-col items-center',
  'forecast-item-title': `text-center text-sm font-medium mb-1 ${grayTxt}`,
  'forecast-item-high': 'text-sm',
  'forecast-item-low': `text-sm ${grayTxt}`,
  'forecast-item-img': 'mb-1 bg-inherit',
  'forecast-item-img-loading': 'h-[48px] w-[48px] rounded-lg bg-gray-50 dark:bg-gray-800',
  error: 'text-sm',
  'preview-wrapper': 'flex items-center',
  'preview-img': 'h-6 w-6 mr-2 bg-inherit rounded',
  'preview-img-loading': 'h-6 w-6 bg-gray-50 dark:bg-gray-800 rounded-xl',
  'preview-temp': 'text-lg',
  'preview-temp-content': 'flex',
  'preview-unit-toggle': `text-xs mt-0.5 ml-1 ${grayTxt}`,
};

export class LitWeather extends LitElement {
  /** Disable shadow-dom */
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return this._error ? this.ErrorContent : this.Content;
  }

  protected get Header() {
    return html`
      <div class=${this._cn.location}>${this._loading ? Skelton.lg : this._data.name}</div>
      <div class=${this._cn.today}>
        ${this._loading ? Skelton.md : `${this._weekDayName} ${this._time}`}
      </div>
      <div class=${this._cn.description}>
        ${this._loading ? Skelton.md : this._data.description}
      </div>

      <div class="${this._cn['temp-wrapper']}">
        ${this._data.weatherImgSrc && !this._loading
          ? html`<img
              class="${this._cn['img']}"
              draggable="false"
              src="${this._data.weatherImgSrc}"
              loading="lazy"
              height="70"
              width="70"
            />`
          : html`<div class=${this._cn['img-loading']}></div>`}

        <div class="${this._cn['temp-content']}">
          <div class="${this._cn['temp']}">${this._data.temp}</div>
          <div class="${this._cn['unit-toggle']}">
            <button
              class=${this.units === 'Imperial' && this._cn['unit-toggle-active']}
              .disabled=${this.units === 'Imperial'}
              @click="${this.toggleUnits}"
            >
              °F
            </button>
            <span> | </span>
            <button
              class=${this.units === 'Metric' && this._cn['unit-toggle-active']}
              .disabled=${this.units === 'Metric'}
              @click="${this.toggleUnits}"
            >
              °C
            </button>
          </div>
        </div>

        <div class="${this._cn['extra-info']}">
          <div>Sunrise: ${this._data.sunrise} &rarr; ${this._data.sunset}</div>
          <div>Humidity: ${this._data.humidity}%</div>
          <div>Wind: ${this._data.wind}</div>
        </div>
      </div>
    `;
  }

  protected get Forecast() {
    return html`
      <div class="${this._cn['forecast-wrapper']}">
        ${this._forecast?.length && !this._loading
          ? repeat(
              this._forecast,
              item => html`
                <div class="${this._cn['forecast-item']}">
                  <div class="${this._cn['forecast-item-title']}">
                    ${item.weekDayName.substring(0, 3)}
                  </div>
                  <img
                    class="${this._cn['forecast-item-img']}"
                    draggable="false"
                    src="${item.weatherImgSrc}"
                    loading="lazy"
                    height="48"
                    width="48"
                  />
                  <div>
                    <span class="${this._cn['forecast-item-high']}">${item.high}°</span>
                    <span class="${this._cn['forecast-item-low']}">${item.low}°</span>
                  </div>
                </div>
              `
            )
          : html`
              <div class="${this._cn['forecast-wrapper']} mt-4">
                ${Array.from({ length: 6 }, (_, i) => i).map(
                  () => html`
                    <div class="flex flex-col justify-center items-center space-y-1">
                      ${Skelton.sm}
                      <div class=${this._cn['forecast-item-img-loading']}></div>
                      ${Skelton.sm}
                    </div>
                  `
                )}
              </div>
            `}
      </div>
    `;
  }

  protected get Preview() {
    return html`
      <div class=${this._cn['preview-wrapper']}>
        ${this._data.weatherImgSrc && !this._loading
          ? html`<img
              class="${this._cn['preview-img']}"
              draggable="false"
              src="${this._data.weatherImgSrc}"
              loading="lazy"
              height="35"
              width="35"
            />`
          : html`<div class=${this._cn['preview-img-loading']}></div>`}

        <div class="${this._cn['preview-temp-content']}">
          <div class="${this._cn['preview-temp']}">${this._data.temp}</div>
          <div class="${this._cn['preview-unit-toggle']}">
            ${this.units === 'Metric' ? '°C' : '°F'}
          </div>
        </div>
      </div>
    `;
  }

  protected get Content() {
    if (this.variant === 'preview') return this.Preview;
    return html` <div class=${this._cn.wrapper}>${this.Header}${this.Forecast}</div>`;
  }

  protected get ErrorContent() {
    return html` <div class=${this._cn.error}>Error loading weather data</div> `;
  }

  /**
   * The query to lookup via openweatherapi. <br/>
   * <code>{city}</code>  <br/>
   * <code>{city}, {state}</code> <br/>
   * <code>{city}, {state}, {country}</code> <br/>
   * <code>{zip code}</code> <br/>
   * <code>{zip code},{country code}</code>
   * */
  @property({ type: String }) declare query: string;
  /** Your openweather API token */
  @property({ type: String }) declare token: string;
  /** The units to use for the weather */
  @property({ type: String }) declare units?: 'Imperial' | 'Metric';
  /** Variant for pre-defined tw classes */
  @property({ type: String }) declare variant?: 'stacked' | 'preview';
  /** Class names applied to elements  */
  @property({ type: Object }) declare cn?: typeof defaultCn;
  /** Icon type, defaults to a combination of material weather icons and openweather icons */
  @property({ type: Boolean }) declare icons?: 'default' | 'openweather';
  /** If you are self-hosting the iconset */
  @property({ type: String }) declare iconBaseUrl?: string;

  /** Private Props */
  /** When true, a request is being made and the skeleton state is shown */
  @state() protected declare _loading?: boolean;
  /** true when there is an error */
  @state() protected declare _error?: boolean;
  /** The day of the week */
  @state() protected declare _weekDayName?: string;
  /** The current time */
  @state() protected declare _time?: string;
  /** The forecast data */
  @state() protected declare _forecast?: {
    weekDayName: string;
    high: number;
    low: number;
    weatherImgSrc: string;
  }[];
  /** API response for the current weather  */
  @state() protected declare _data: {
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
  };
  /** Applied classnames */
  @state() protected _cn = defaultCn;

  constructor() {
    super();
    this.units = 'Imperial';
    this.variant = 'stacked';
    this.cn = defaultCn;
    this.iconBaseUrl = 'https://www.unpkg.com/lit-weather/icons/';
    this._loading = true;
    this._data = {};
    this._forecast = [];
    this._time = getLocalTime(new Date());
    this._weekDayName = getWeekDay(new Date().getDay());
    this._error = false;
  }

  firstUpdated() {
    this._cn = this.cn || defaultCn;
  }

  updated(changed: Map<string, any>) {
    if (changed.has('token') || changed.has('query') || changed.has('units')) {
      this._generateRequests(this.token, this.query);
    }
    if (changed.has('loading')) {
      this.dispatchEvent(new CustomEvent('loading-changed', { detail: { value: this._loading } }));
    }
  }

  toggleUnits() {
    this.units = this.units === 'Imperial' ? 'Metric' : 'Imperial';
    this.refresh();
  }

  refresh() {
    this._time = getLocalTime(new Date());
    this._generateRequests(this.token, this.query);
  }

  _generateRequests(key: typeof this.token, query: typeof this.query) {
    if (!key || !query) return;
    this._error = false;
    this._loading = true;

    const locationParam = this._getLocationParam(query);
    this._getCurrentWeather(key, locationParam);
    this._getForecast(key, locationParam);
  }

  _getLocationParam(query: string) {
    const firstChar: string = query.charAt(0);
    const isZipCode = !isNaN(parseInt(firstChar));
    return isZipCode ? `zip=${query}` : `q=${query}`;
  }

  _getCurrentWeather(key: string, locationParam: string) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?${locationParam}&appid=${key}&units=${this.units}`
    )
      .then(response => {
        if (!response.ok) throw new Error('Something went wrong');
        return response.json();
      })
      .then(data => {
        this._loading = false;
        this._time = getLocalTime(new Date(data.dt * 1000));
        this._weekDayName = getWeekDay(new Date(data.dt * 1000 + data.timezone * 1000).getDay());
        this._data = {
          id: data.id,
          name: data.name,
          sunrise: getLocalTime(new Date(data.sys.sunrise * 1000)),
          sunset: getLocalTime(new Date(data.sys.sunset * 1000)),
          temp: +data.main.temp.toFixed(0),
          tempFeelsLike: +data.main.feels_like.toFixed(0),
          description: data.weather[0].description,
          humidity: data.main.humidity,
          wind: `${data.wind.speed.toFixed(0)} ${this.units === 'Imperial' ? 'mph' : 'km/h'}`,
          weatherImgSrc: this._imgSrc({
            icon: data.weather[0].icon,
            id: data.weather[0].id,
            dynamicDayOrNightString: true,
          }),
          fullForecastUrl: `https://openweathermap.org/city/${data.id}`,
        };
        this.dispatchEvent(new CustomEvent('data-changed', { detail: { value: this._data } }));
      })
      .catch(() => {
        this._handleWeatherError();
      });
  }

  _getForecast(key: string, locationParam: string) {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?${locationParam}&appid=${key}&units=${this.units}`
    )
      .then(response => {
        if (!response.ok) throw new Error('Something went wrong');
        return response.json();
      })
      .then(data => {
        this._loading = false;
        this._forecast = this._computeForecast(data.list) as any[];
      })
      .catch(() => {
        this._handleWeatherError();
      });
  }

  _handleWeatherError() {
    this._loading = false;
    this._error = true;
    this._data = {};
    this._forecast = [];
    this.requestUpdate();
  }

  _computeForecast(items: any) {
    if (!items || !items.length) return [];

    const data = {} as any;
    // Loop through each item
    for (const item of items) {
      // Convert the forecast date to a JavaScript date object
      const forecastDate = new Date(item.dt_txt);
      // Create a key to represent the forecast date (month and day)
      const forecastDateKey = `${forecastDate.getMonth() + 1}-${forecastDate.getDate()}`;
      // Get the forecast data for the day (if it already exists)
      const day = data[forecastDateKey] || {};
      // Get the high and low temperatures for the day
      const high = item.main.temp_max;
      const low = item.main.temp_min;
      // Update the day's high and low temperatures (if they don't exist or are higher/lower than current values)
      day.high = !day.high || day.high < high ? +high.toFixed(0) : day.high;
      day.low = !day.low || day.low > low ? +low.toFixed(0) : day.low;
      // Get the weekday name (if it doesn't exist)
      if (!day.weekDayName) {
        day.weekDayName = getWeekDay(forecastDate.getDay());
      }
      // Get the weather icon and ID
      const weather = item.weather[0];
      if (!day.weatherCodes) {
        day.weatherCodes = [];
      }
      day.weatherCodes = [[weather.icon, weather.id], ...day.weatherCodes];
      // Update the forecast data for the day
      data[forecastDateKey] = day;
    }

    // Attempt to look for the most prominent weather codes for each day
    // https://stackoverflow.com/a/20762713
    function getMostProminentWeatherId(arr: number[]): number | string | undefined {
      const sortedArr = arr.sort(
        (a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length
      );
      return sortedArr.pop();
    }

    // Create an array of forecast data for each day
    const response = Object.keys(data).map(k => {
      const codes = data[k].weatherCodes;
      const icon = getMostProminentWeatherId(codes.map((code: string) => code[0])) as string;
      const id = getMostProminentWeatherId(codes.map((code: string) => code[1])) as number;
      return {
        weatherImgSrc: this._imgSrc({ icon, id }),
        ...data[k],
      };
    });

    // Remove the last day (as it is inaccurate)
    // response.pop();

    return response;
  }

  _imgSrc({
    icon,
    id,
    dynamicDayOrNightString = false,
  }: {
    icon: string;
    id: number;
    dynamicDayOrNightString?: boolean;
  }) {
    if (!icon && !id) {
      return '';
    }

    let iconType = '';
    const dayOrNightStr = dynamicDayOrNightString
      ? icon.indexOf('d') > -1
        ? 'day'
        : 'night'
      : 'day';

    const baseUrl =
      this.icons === 'openweather' && icon ? 'http://openweathermap.org/img/wn/' : this.iconBaseUrl;

    const idRanges = [
      { range: [200, 232], type: 'thunder' },
      { range: [300, 531], type: 'rainy' },
      { range: [600, 622], type: 'snow' },
      { range: [721, 771], type: 'haze' },
      { range: [731, 781], type: 'windy' },
      { range: [800, 800], type: 'clear' },
      { range: [801, 801], type: 'partly-cloudy' },
      { range: [802, 803], type: 'mostly-cloudy' },
      { range: [804, 804], type: 'cloudy-weather' },
    ];

    idRanges.forEach(range => {
      if (id >= range.range[0] && id <= range.range[1]) {
        iconType = range.type;
      }
    });

    if (iconType) {
      const dayNightStr = iconType !== 'cloudy-weather' ? `-${dayOrNightStr}` : '';
      return `${baseUrl}/${iconType}${dayNightStr}.png`;
    }

    if (icon) {
      return `http://openweathermap.org/img/wn/${icon}@2x.png`;
    }

    return `${this.iconBaseUrl}/unknown.png`;
  }
}

// These types help TypeScript understand the types of the properties and events when this component is used in other frameworks
declare global {
  interface HTMLElementTagNameMap {
    'lit-weather': LitWeather;
  }
  // https://coryrylan.com/blog/how-to-use-web-components-with-typescript-and-react
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      ['lit-weather']: Partial<LitWeather> &
        Pick<LitWeather, 'query' | 'token' | 'units' | 'variant' | 'cn' | 'icons' | 'iconBaseUrl'>;
    }
  }
}
