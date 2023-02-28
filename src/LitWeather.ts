import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

const today = new Date();
const getLocalTime = time =>
  time.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
const getWeekDay = index =>
  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index];

const secondaryTextColorClasses = /*tw*/ 'text-gray-500 dark:text-gray-400';

const bg = {
  50: 'bg-gray-50 dark:bg-gray-900',
};

const skeletonLg = /*tw*/ html`<div
  class="h-5 w-48 bg-gray-50 dark:bg-gray-900 rounded-lg mb-3"
></div>`;
const skeleton = /*tw*/ html`<div
  class="h-4 w-20 bg-gray-50 dark:bg-gray-900 rounded-lg mb-2"
></div>`;
const skeletonSm = /*tw*/ html`<div
  class="h-3 w-8 bg-gray-50 dark:bg-gray-900 rounded-lg mb-1"
></div>`;
const classNames = /*tw*/ {
  wrapper: 'block',
  'location-wrapper': '',
  location: 'text-2xl font-medium',
  today: `text-base ${secondaryTextColorClasses}`,
  description: `text-sm mb-3 capitalize ${secondaryTextColorClasses}`,
  time: `text-base mb-4 ${secondaryTextColorClasses}`,
  'temp-wrapper-desktop': 'flex flex-col-reverse',
  'temp-wrapper': 'flex horizontal',
  'img-temp-wrapper': 'flex',
  img: 'h-[70px] w-[70px] mr-3',
  'unit-toggle': `text-lg mt-1.5 ml-2 ${secondaryTextColorClasses}`,
  'unit-toggle-active': `text-black dark:text-white`,
  temp: 'text-7xl',
  'extra-info': `flex-col text-xs ml-6 mt-2 hidden sm:flex ${secondaryTextColorClasses}`,
  'forecast-wrapper': 'flex flex-wrap gap-6 sm:gap-8 mt-4',
  'forecast-item': 'flex flex-col items-center',
  'forecast-item-title': `text-center text-sm font-medium mb-1 ${secondaryTextColorClasses}`,
  'forecast-item-high': 'text-sm',
  'forecast-item-low': `text-sm ${secondaryTextColorClasses}`,
  'forecast-item-img': 'mb-1',
  'error-img': 'h-[120px] w-[120px] mb-4',
  'error-text': 'text-2xl text-center',
  'mobile-header': 'md:hidden',
  loading: 'text-center',
};
export class LitWeather extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  render() {
    return this.error ? this.ErrorContent : this.Content;
  }

  get Header() {
    return html`
      <div class=${this.cn['temp-wrapper-desktop']}>
        <div class="${this.cn['temp-wrapper']}">
          ${this.data.weatherImgSrc && !this.loading
            ? html`<img
                class="${this.cn['img']}"
                draggable="false"
                src="${this.data.weatherImgSrc}"
                loading="lazy"
                height="70"
                width="70"
              />`
            : html`<div
                class=${`${this.cn['img']} h-[70px] w-[70px] ${bg['50']} rounded-xl`}
              ></div>`}

          <div class="${this.cn['img-temp-wrapper']}">
            <div class="${this.cn['temp']}">${this.data.temp}</div>
            <div class="${this.cn['unit-toggle']}">
              <button
                class=${this.units === 'Imperial' && this.cn['unit-toggle-active']}
                .disabled=${this.units === 'Imperial'}
                @click="${this.toggleUnits}"
              >
                °F
              </button>
              <span> | </span>
              <button
                class=${this.units === 'Metric' && this.cn['unit-toggle-active']}
                .disabled=${this.units === 'Metric'}
                @click="${this.toggleUnits}"
              >
                °C
              </button>
            </div>
          </div>

          <div class="${this.cn['extra-info']}">
            <div>Sunrise: ${this.data.sunrise} &rarr; ${this.data.sunset}</div>
            <div>Humidity: ${this.data.humidity}%</div>
            <div>Wind: ${this.data.wind}</div>
          </div>
        </div>

        <div class="flex flex-1"></div>

        <div class=${this.cn['location-wrapper']}>
          <div class=${this.cn.location}>${this.loading ? skeletonLg : this.data.name}</div>
          <div class=${this.cn.today}>
            ${this.loading ? skeleton : `${this.weekDayName} ${this.time}`}
          </div>
          <div class=${this.cn.description}>${this.loading ? skeleton : this.data.description}</div>
        </div>
      </div>
    `;
  }

  get Forecast() {
    return html`
      <div class="${this.cn['forecast-wrapper']}">
        ${this.forecast?.length && !this.loading
          ? repeat(
              this.forecast,
              item => html`
                <div class="${this.cn['forecast-item']}">
                  <div class="${this.cn['forecast-item-title']}">
                    ${item.weekDayName.substring(0, 3)}
                  </div>
                  <img
                    class="${this.cn['forecast-item-img']}"
                    draggable="false"
                    src="${item.weatherImgSrc}"
                    loading="lazy"
                    height="48"
                    width="48"
                  />
                  <div>
                    <span class="${this.cn['forecast-item-high']}">${item.high}°</span>
                    <span class="${this.cn['forecast-item-low']}">${item.low}°</span>
                  </div>
                </div>
              `
            )
          : html`
              <div class="${this.cn['forecast-wrapper']} mt-4">
                <div class="flex flex-col justify-center items-center">
                  ${skeletonSm}
                  <div class="h-[48px] w-[48px] rounded-lg bg-gray-50 dark:bg-gray-900"></div>
                  ${skeletonSm}
                </div>
                <div class="flex flex-col justify-center items-center">
                  ${skeletonSm}
                  <div class="h-[48px] w-[48px] rounded-lg bg-gray-50 dark:bg-gray-900"></div>
                  ${skeletonSm}
                </div>
                <div class="flex flex-col justify-center items-center">
                  ${skeletonSm}
                  <div class="h-[48px] w-[48px] rounded-lg bg-gray-50 dark:bg-gray-900"></div>
                  ${skeletonSm}
                </div>
              </div>
            `}
      </div>
    `;
  }

  get Content() {
    return html` <div class=${this.cn.wrapper}>${this.Header}${this.Forecast}</div> `;
  }

  get LoadingContent() {
    return html`
      <div class="${this.cn.loading}">
        <div>• • •</div>
      </div>
    `;
  }

  get ErrorContent() {
    return html` <div class="flex justify-center">Error loading weather data</div> `;
  }

  /** API response for the current weather  */
  @property({ type: Object }) data: {
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
  } = {};
  /** Class names applied to elements  */
  @property({ type: Object }) cn = classNames;
  /** Your openweather API token */
  @property({ type: String }) token = '';
  /** Self host the icons */
  @property({ type: String }) iconBaseUrl: string = 'https://www.unpkg.com/lit-weather/icons/';
  /**
   * The query to lookup via openweatherapi
   * {city name}
   * {city name}, {state}
   * {city name}, {state}, {country code}
   * {zip code}
   * {zip code},{country code}
   * */
  @property({ type: String }) query = '';
  /** Whether or not to show the loading spinner */
  @property({ type: Boolean }) loading = true;
  /** The units to use for the weather */
  @property({ type: String }) units: 'Imperial' | 'Metric' = 'Imperial';
  /** The variant for pre-defined tw classes */
  @property({ type: String }) variant: 'stacked' | 'horizontal' = 'stacked';
  /** The day of the week */
  @property({ type: String }) weekDayName: string = getWeekDay(today.getDay());
  /** The current time */
  @property({ type: String }) time: string = getLocalTime(today);
  /** Whether or not to use the openweather icons */
  @property({ type: Boolean }) icons: 'default' | 'openweather' = 'default';
  /** The forecast data */
  @property({ type: Boolean }) forecast: {
    weekDayName: string;
    high: number;
    low: number;
    weatherImgSrc: string;
  }[] = [];
  /** Whether or not there was an error */
  @property({ type: Boolean }) error = false;

  firstUpdated(changed: Map<string, any>) {
    if (!this.token || !this.query) return;

    // When the variant is not the default stacked, we need to add the tw classes
    if (this.variant === 'horizontal') {
      this.cn = /*tw*/ {
        ...this.cn,
        'location-wrapper': 'sm:ml-4 sm:text-right',
        'temp-wrapper-desktop': 'flex flex-col-reverse sm:flex-row',
      };
    }

    this._generateRequests(this.token, this.query);
  }

  updated(changed: Map<string, any>) {
    console.log(changed.has('units'));
    if (changed.has('token') || changed.has('query') || changed.has('units')) {
      this._generateRequests(this.token, this.query);
    }
    if (changed.has('loading')) {
      this.dispatchEvent(new CustomEvent('loading-changed', { detail: { value: this.loading } }));
    }
  }

  toggleUnits() {
    this.units = this.units === 'Imperial' ? 'Metric' : 'Imperial';
    console.log('toggled', this.units);
    this.refresh();
  }

  refresh() {
    this.time = getLocalTime(new Date());
    this._generateRequests(this.token, this.query);
  }

  _generateRequests(key, query) {
    if (!key || !query) return;
    this.error = false;
    this.loading = true;
    this.requestUpdate();

    const locationParam = this._getLocationParam(query);
    this._getCurrentWeather(key, locationParam);
    this._getForecast(key, locationParam);
  }

  _getLocationParam(query) {
    const firstChar = query.toString().charAt(0);
    const isZipCode = !isNaN(firstChar - parseFloat(firstChar));
    return isZipCode ? `zip=${query}` : `q=${query}`;
  }

  _getCurrentWeather(key, locationParam) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?${locationParam}&appid=${key}&units=${this.units}`
    )
      .then(response => {
        if (!response.ok) throw new Error('Something went wrong');
        return response.json();
      })
      .then(data => {
        this.loading = false;
        this.time = getLocalTime(new Date(data.dt * 1000));
        this.weekDayName = getWeekDay(new Date(data.dt * 1000 + data.timezone * 1000).getDay());

        console.log(this.weekDayName);
        this.data = {
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
        console.log(data);
        this.dispatchEvent(new CustomEvent('data-changed', { detail: { value: this.data } }));
        this.requestUpdate();
      })
      .catch(error => {
        this._handleWeatherError(error);
      });
  }

  _getForecast(key, locationParam) {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?${locationParam}&appid=${key}&units=${this.units}`
    )
      .then(response => {
        if (!response.ok) throw new Error('Something went wrong');
        return response.json();
      })
      .then(data => {
        this.loading = false;
        this.forecast = this._computeForecast(data.list) as any[];
        this.requestUpdate();
      })
      .catch(error => {
        this._handleWeatherError(error);
      });
  }

  _handleWeatherError(err) {
    this.loading = false;
    this.error = true;
    this.data = {};
    this.forecast = [];
    this.requestUpdate();
  }

  _computeForecast(items) {
    if (!items || !items.length) return [];

    let data = {};
    // Loop through each item
    for (const item of items) {
      // Convert the forecast date to a JavaScript date object
      const forecastDate = new Date(item.dt_txt);
      // Create a key to represent the forecast date (month and day)
      const forecastDateKey = `${forecastDate.getMonth() + 1}-${forecastDate.getDate()}`;
      console.log(forecastDateKey);
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
    // prettier-ignore
    const getMostProminentWeatherId = (arr) => arr.sort((a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length).pop();

    // Create an array of forecast data for each day
    const response = Object.keys(data).map(k => {
      const codes = data[k].weatherCodes;
      const icon = getMostProminentWeatherId(codes.map(code => code[0]));
      const id = getMostProminentWeatherId(codes.map(code => code[1]));
      return {
        weatherImgSrc: this._imgSrc({ icon, id }),
        ...data[k],
      };
    });

    // Remove the last day (as it is inaccurate)
    // response.pop();
    console.log(response);
    return response;
  }

  _imgSrc({ icon, id, dynamicDayOrNightString = false }) {
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

declare global {
  interface HTMLElementTagNameMap {
    'lit-weather': LitWeather;
  }
}
