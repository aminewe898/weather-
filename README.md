# Reus weather card

A small browser exercise using HTML, CSS, JavaScript, and OpenWeather's current-weather/forecast endpoints. It shows local browser time, temperature, and whether available forecast intervals indicate rain tomorrow in Reus.

## Run

Serve the directory with `python -m http.server 8000`, open the page, and enter your own dedicated OpenWeather demo key. It is sent directly to OpenWeather and cleared from the field after submission; it is not persisted in browser storage. Browser requests can still be inspected by the browser user, so this pattern is for a learning demo, not protecting a production service credential.

The previous committed key was removed from current source. Anyone who controlled that key should revoke/rotate it; old Git history still contains it. No credential validity or provider request was tested during curation.

## Scope and limitations

This is a completed small UI/API exercise, not a forecasting service. It depends on API access/network availability, uses forecast intervals rather than guaranteeing rain/no rain, and reports request failures. The weather location is fixed to Reus; the clock uses the browser's local timezone.
