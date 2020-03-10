import { html, fixture, expect } from '@open-wc/testing';

import '../lit-weather.js';

describe('LitWeather', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture(html`
      <lit-weather></lit-weather>
    `);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture(html`
      <lit-weather></lit-weather>
    `);
    el.shadowRoot.querySelector('button').click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture(html`
      <lit-weather title="attribute title"></lit-weather>
    `);

    expect(el.title).to.equal('attribute title');
  });

  it('shows initially the text "hey there Nr. 5!" and an "increment" button', async () => {
    const el = await fixture(html`
      <lit-weather></lit-weather>
    `);

    expect(el).shadowDom.to.equalSnapshot();
  });

  it('passes the a11y audit', async () => {
    const el = await fixture(html`
      <lit-weather></lit-weather>
    `);

    await expect(el).shadowDom.to.be.accessible();
  });
});
