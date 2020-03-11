import { html, css, LitElement } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';

// prettier-ignore
const getLocalTime = (time) => time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
// prettier-ignore
const getWeekDay = index => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index];

export class LitWeather extends LitElement {
  static get styles() {
    return css`
      :host {
        --ps-lit-weather-header-text-color: #212121;
        --ps-lit-weather-text-color: #878787;
        --ps-lit-weather-secondary-text-color: #bababa;
        --ps-lit-weather-spacing-xs: 8px;
        --ps-lit-weather-spacing-s: 12px;
        --ps-lit-weather-spacing-m: 20px;
        --ps-lit-weather-spacing-l: 36px;

        display: block;
        /* System fonts */
        /* prettier-ignore */
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        color: var(--ps-lit-weather-text-color);
        line-height: 1.4;
        font-size: 14px;
      }

      [part='location'] {
        font-size: x-large;
      }

      [part='today'],
      [part='description'] {
        font-size: medium;
      }

      [part='description'] {
        text-transform: capitalize;
        margin-bottom: var(--ps-lit-weather-spacing-m);
      }

      [part='temp-wrapper'] {
        margin-bottom: var(--ps-lit-weather-spacing-m);
      }

      [part='img-temp-wrapper'] {
        flex: 1;
      }

      [part='temp'] {
        color: var(--ps-lit-weather-header-text-color);
        font-size: 64px;
        line-height: 1;
      }

      [part='img'] {
        margin-right: 10px;
        height: 70px;
        width: 70px;
      }

      [part='unit-toggle'] {
        font-size: 16px;
        margin-top: 6px;
        margin-left: 2px;
      }

      [part='extra-info'] {
        display: flex;
        flex-direction: column;
        font-size: medium;
        flex: 1;
        margin-left: var(--ps-lit-weather-spacing-l);
      }

      [part='forcast-wrapper'] {
        overflow: auto;
      }

      [part='forcast-item'] {
        min-width: 70px;
        padding: 10px;
        color: var(--ps-lit-weather-secondary-text-color);
      }

      [part='forcast-item-title'] {
        text-align: center;
        line-height: 15px;
        margin-bottom: var(--ps-lit-weather-spacing-xs);
      }

      [part='forcast-item-high'],
      [part='forcast-item-low'] {
        line-height: 15px;
        font-size: 13px;
      }

      [part='forcast-item-high'] {
        color: var(--ps-lit-weather-text-color);
      }

      [part='error-img'] {
        height: 120px;
        width: 120px;
        margin-bottom: var(--ps-lit-weather-spacing-s);
      }
      [part='error-text'] {
        text-align: center;
        font-size: x-large;
      }

      .mobile-header {
        display: none;
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 0;
        }
        50% {
          transform: scale(1.2);
          opacity: 1;
        }
      }
      [part='loading'] {
        text-align: center;
      }
      [part='loading'] > * {
        animation: pulse 1s infinite ease-in-out;
        will-change: opacity, transform;
        display: inline-block;
        padding: 64px;
      }

      @media (max-width: 390px) {
        [part='img-temp-wrapper'] {
          flex: 1;
        }
        [part='extra-info'] {
          font-size: 12px;
          min-width: 90px;
          max-width: 90px;
        }

        [part='img'] {
          margin-right: 5px;
          height: 48px;
          width: 48px;
        }

        [part='temp'] {
          font-size: 48px;
          letter-spacing: -1px;
        }

        [part='unit-toggle'] {
          font-size: 13px;
          margin-top: 2px;
          margin-left: 2px;
        }

        [part='extra-info'] {
          margin-left: var(--ps-lit-weather-spacing-s);
        }

        [part='location'] {
          color: var(--ps-lit-weather-header-text-color);
          font-size: 18px;
        }

        [part='today'],
        [part='description'] {
          display: none;
        }

        .mobile-header {
          display: block;
          font-size: 12px;
          margin-bottom: 26px;
        }
      }

      /* Helper Classes */
      * {
        box-sizing: border-box;
      }
      .horizontal {
        display: flex;
        flex-direction: row;
      }
      .center {
        align-items: center;
      }
      .center-center {
        align-items: center;
        justify-content: center;
      }
      .capitalize {
        text-transform: capitalize;
      }
    `;
  }

  render() {
    return this.loading ? this.loadingTm : this.pageContent;
  }

  get pageContent() {
    return html`
      ${this.error ? this.errorTm : this.content}
    `;
  }

  get content() {
    return html`
      <div part="location">${this.data.name}</div>
      <div part="today">${this.weekDayName} ${this.time}</div>
      <div part="description">${this.data.description}</div>

      <div class="mobile-header">
        ${this.weekDayName.substring(0, 3)} ${this.time.substring(0, 2)}
        ${this.time.substring(this.time.length - 2, this.time.length)},
        <span class="capitalize">${this.data.description}</span>
      </div>

      <div part="temp-wrapper" class="horizontal center">
        <img
          part="img"
          draggable="false"
          src="${this.data.weatherImgSrc}"
          loading="lazy"
          height="70"
          width="70"
        />

        <div part="img-temp-wrapper" class="horizontal">
          <div part="temp">${this.data.temp}</div>
          <div part="unit-toggle">
            <span @click="${this.toggleUnits}">°F</span>
            <span> | </span>
            <span @click="${this.toggleUnits}">°C</span>
          </div>
        </div>

        <div part="extra-info">
          <div>Sunrise: ${this.data.sunrise}</div>
          <div>Sunset: ${this.data.sunset}</div>
          <div>Humidity: ${this.data.humidity}%</div>
          <div>Wind: ${this.data.wind}</div>
        </div>
      </div>

      <div part="forcast-wrapper" class="horizontal">
        ${repeat(
          this.forecast,
          item => html`
            <div part="forcast-item">
              <div part="forcast-item-title">${item.weekDayName.substring(0, 3)}</div>
              <img
                part="forcast-item-img"
                draggable="false"
                src="${item.weatherImgSrc}"
                loading="lazy"
                height="45"
                width="45"
              />
              <div>
                <span part="forcast-item-high">${item.high}°</span>
                <span part="forcast-item-low">${item.low}°</span>
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  get loadingTm() {
    return html`
      <div part="loading">
        <div>• • •</div>
      </div>
    `;
  }

  get errorTm() {
    return html`
      <div class="horizontal center-center">
        <img
          part="error-img"
          draggable="false"
          src="${this.iconBaseUrl}/unknown.png"
          loading="lazy"
          height="120"
          width="120"
        />
      </div>
      <div part="error-text">Error getting weather</div>
    `;
  }

  static get properties() {
    return {
      // openweathermap API key
      apiKey: { type: String },
      // See https://openweathermap.org/current
      // {city name},
      // {city name}, {state}
      // {city name}, {state}, {country code}
      // {zip code}
      // {zip code},{country code}
      query: { type: String },
      // True when data is loading
      loading: { type: Boolean },
      // 'Metric' or 'Imperial'
      units: { type: String },
      // Current day of the week
      weekDayName: { type: String },
      // Time when data was last requested
      time: { type: String },
      // Set to true to use open weather icons
      useOpenWeatherIcons: { type: Boolean },
      // BaseUrl for custom icons
      // defaults to '/icons'
      iconBaseUrl: { type: String },
      // Data object
      data: { type: Object },
      // Forecast object
      forecast: { type: Array },
      error: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.query = '';
    this.data = {};
    this.loading = true;
    this.units = 'Imperial';
    // Set date and times
    const today = new Date();
    this.weekDayName = getWeekDay(today.getDay());
    this.time = getLocalTime(today);
    this.useOpenWeatherIcons = false;
    this.forecast = [];
    this.iconBaseUrl = '/icons';
    this.error = false;
  }

  updated(changed) {
    if (changed.has('apiKey') || changed.has('query') || changed.has('units')) {
      this._generateRequests(this.apiKey, this.query);
    }
  }

  toggleUnits() {
    this.units = this.units === 'Imperial' ? 'Metric' : 'Imperial';
  }

  refresh() {
    this.time = getLocalTime(new Date());
    this._generateRequests(this.apiKey, this.query);
  }

  _generateRequests(key, query) {
    if (!key || !query) return;
    this.error = false;
    this.loading = true;

    const locationParam = this._getLocationParam(query);
    this._getCurrentWeather(key, locationParam);
    this._getForecast(key, locationParam);
  }

  // eslint-disable-next-line class-methods-use-this
  _getLocationParam(query) {
    // eslint-disable-next-line no-restricted-globals
    const firstChar = query.toString().charAt(0);
    const isZipCode = !isNaN(firstChar - parseFloat(firstChar));
    return isZipCode ? `zip=${query}` : `q=${query}`;
  }

  _getCurrentWeather(key, locationParam) {
    const url = `https://api.openweathermap.org/data/2.5/weather?${locationParam}&appid=${key}&units=${this.units}`;
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Something went wrong');
        return response.json();
      })
      .then(data => {
        this.loading = false;
        this.data = {
          id: data.id,
          name: data.name,
          sunrise: getLocalTime(new Date(data.sys.sunrise * 1000)),
          sunset: getLocalTime(new Date(data.sys.sunset * 1000)),
          temp: +data.main.temp.toFixed(0),
          description: data.weather[0].description,
          humidity: data.main.humidity,
          wind: `${data.wind.speed.toFixed(0)} ${this.units === 'Imperial' ? 'mph' : 'km/h'}`,
          weatherImgSrc: this._computeWeatherImgSrc({
            icon: data.weather[0].icon,
            id: data.weather[0].id,
            dynamicDayOrNightString: true,
          }),
          fullForecastUrl: `https://openweathermap.org/city/${data.id}`,
        };
        this.dispatchEvent(new CustomEvent('data-changed', { detail: { value: this.data } }));
      })
      .catch(error => {
        this._handleWeatherError(error);
      });
  }

  _getForecast(key, locationParam) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?${locationParam}&appid=${key}&units=${this.units}`;
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Something went wrong');
        return response.json();
      })
      .then(data => {
        this.loading = false;
        this.forecast = this._computeForecast(data.list);
      })
      .catch(error => {
        this._handleWeatherError(error);
      });
  }

  // Handle fetch error's
  _handleWeatherError(err) {
    this.loading = false;
    this.error = true;
    this.data = {};
    this.forecast = [];
    // eslint-disable-next-line no-console
    console.error('Error getting lit-weather data', err);
  }

  // Compute the forecast as best as we can with the data returned from openweathermap
  // This computation is being done because the full day forecast requires a paid account
  // PR's welcome here to refactor how this is done, there is room for improvement
  _computeForecast(items) {
    if (!items || !items.length) return [];

    let data = {};
    for (const item of items) {
      // item forecast date object
      const forecastDate = new Date(item.dt_txt);
      // item unique forecast date key
      const forecastDateKey = `${forecastDate.getMonth() + 1}-${forecastDate.getDate()}`;

      // Existing "Day" data
      const day = data[forecastDateKey] || {};

      // Highs and lows
      // Current hours high
      const high = item.main.temp_max;
      // Current hours low
      const low = item.main.temp_min;
      // Set new high if this hours high is greater than what aready exists or if no existing value is present
      day.high = !day.high || day.high < high ? +high.toFixed(0) : day.high;
      // Set new low if this hours low is less than what aready exists or if no existing value is present
      day.low = !day.low || day.low > low ? +low.toFixed(0) : day.low;

      // Set week day label
      if (!day.weekDayName) day.weekDayName = getWeekDay(forecastDate.getDay());

      // Weather codes
      const weather = item.weather[0];
      if (!day.weatherCodes) day.weatherCodes = [];
      day.weatherCodes = [[weather.icon, weather.id], ...day.weatherCodes];

      // Set day data in the object array
      data[forecastDateKey] = day;
    }

    // Attempt to look for the most prominent weather codes for each day
    // https://stackoverflow.com/a/20762713
    // prettier-ignore
    const getMostProminentWeatherId = (arr) => arr.sort((a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length).pop();

    // Convert data object to array and map weatherImgSrc accordingly
    data = Object.keys(data).map(k => {
      const codes = data[k].weatherCodes;
      const icon = getMostProminentWeatherId(codes.map(code => code[0]));
      const id = getMostProminentWeatherId(codes.map(code => code[1]));
      return {
        weatherImgSrc: this._computeWeatherImgSrc({ icon, id }),
        ...data[k],
      };
    });
    // Remove the last item, it was very inaccurate and only contained one record from my testing
    data.pop();

    return data;
  }

  _computeWeatherImgSrc({ icon, id, dynamicDayOrNightString }) {
    if (!icon && !id) return '';
    if (this.useOpenWeatherIcons && icon) return `http://openweathermap.org/img/wn/${icon}@2x.png`;

    let dayOrNightStr = 'day';
    // When setting the current weather img, show the icon for day or night according to the icon string returned from openWeather
    // This is so we do not have to compare any dates in the local timezone
    if (dynamicDayOrNightString) {
      dayOrNightStr = icon.indexOf('d') > -1 ? 'day' : 'night';
    }

    // https://openweathermap.org/weather-conditions
    switch (id) {
      case 200:
      case 201:
      case 202:
      case 210:
      case 211:
      case 212:
      case 221:
      case 230:
      case 231:
      case 232:
        return `${this.iconBaseUrl}/thunder-${dayOrNightStr}.png`;
      case 300:
      case 301:
      case 302:
      case 303:
      case 304:
      case 311:
      case 320:
      case 321:
      case 322:
      case 331:
      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
      case 511:
      case 520:
      case 521:
      case 522:
      case 531:
        return `${this.iconBaseUrl}/rainy-${dayOrNightStr}.png`;
      case 600:
      case 601:
      case 602:
      case 611:
      case 612:
      case 613:
      case 615:
      case 616:
      case 620:
      case 621:
      case 622:
        return `${this.iconBaseUrl}/snow-${dayOrNightStr}.png`;
      case 721:
      case 741:
      case 751:
      case 761:
      case 762:
      case 771:
        return `${this.iconBaseUrl}/haze-${dayOrNightStr}.png`;
      case 731:
      case 781:
        return `${this.iconBaseUrl}/windy-${dayOrNightStr}.png`;
      case 800:
        return `${this.iconBaseUrl}/clear-${dayOrNightStr}.png`;
      case 801:
        return `${this.iconBaseUrl}/partly-cloudy-${dayOrNightStr}.png`;
      case 802:
      case 803:
        return `${this.iconBaseUrl}/mostly-cloudy-${dayOrNightStr}.png`;
      case 804:
        return `${this.iconBaseUrl}/cloudy-weather.png`;
      default:
        if (icon) return `http://openweathermap.org/img/wn/${icon}@2x.png`;
        return `${this.iconBaseUrl}/unknown.png`;
    }
  }
}
