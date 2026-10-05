const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');

function harness(fetch) {
  const elements = new Map();
  const handlers = new Map();
  const document = { getElementById(id) {
    if (!elements.has(id)) elements.set(id, { value: '', textContent: '', disabled: false,
      addEventListener(event, callback) { handlers.set(`${id}:${event}`, callback); } });
    return elements.get(id);
  } };
  vm.runInNewContext(source, { document, Date, URLSearchParams, setInterval() {}, fetch });
  document.getElementById('api-key').value = 'synthetic-demo-key';
  return { elements, submit: () => handlers.get('weather-form:submit')({ preventDefault() {} }) };
}

test('weather and rain render from mock responses and the input key is cleared', async () => {
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(12, 0, 0, 0);
  const h = harness(async url => ({ ok: true, json: async () => url.includes('/forecast?')
    ? { list: [{ dt: tomorrow.getTime() / 1000, weather: [{ main: 'Rain' }] }] }
    : { main: { temp: 20 } } }));
  await h.submit();
  assert.equal(h.elements.get('temp').textContent, '20 °C');
  assert.equal(h.elements.get('rain').textContent, 'Rain forecast tomorrow');
  assert.equal(h.elements.get('api-key').value, '');
  assert.equal(h.elements.get('load-weather').disabled, false);
});

test('provider failure produces a retry message without leaking the key', async () => {
  const h = harness(async () => ({ ok: false, status: 401 }));
  await h.submit();
  assert.equal(h.elements.get('temp').textContent, 'Weather unavailable');
  assert.match(h.elements.get('rain').textContent, /retry/);
  assert.equal(h.elements.get('load-weather').disabled, false);
});
