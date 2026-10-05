const city = "Reus";
function updateTime() {
  document.getElementById("time").textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
updateTime();
setInterval(updateTime, 60000);

document.getElementById("weather-form").addEventListener("submit", async event => {
  event.preventDefault();
  const input = document.getElementById("api-key");
  const key = input.value.trim();
  input.value = "";
  const button = document.getElementById("load-weather");
  button.disabled = true;
  const temp = document.getElementById("temp");
  const rain = document.getElementById("rain");
  temp.textContent = "Loading…";
  rain.textContent = "Checking forecast…";
  try {
    async function request(endpoint) {
      const params = new URLSearchParams({ q: city, units: "metric", appid: key });
      const response = await fetch(`https://api.openweathermap.org/data/2.5/${endpoint}?${params}`);
      if (!response.ok) throw new Error("Weather service rejected the request");
      return response.json();
    }
    const [current, forecast] = await Promise.all([request("weather"), request("forecast")]);
    if (!Number.isFinite(current.main?.temp) || !Array.isArray(forecast.list)) throw new Error("Invalid service response");
    temp.textContent = `${current.main.temp} °C`;
    const target = new Date(); target.setDate(target.getDate() + 1);
    const matching = forecast.list.filter(item => new Date(item.dt * 1000).toLocaleDateString("en-CA", { timeZone: "Europe/Madrid" }) === target.toLocaleDateString("en-CA", { timeZone: "Europe/Madrid" }));
    rain.textContent = matching.length === 0 ? "Forecast unavailable" : matching.some(item => item.weather?.some(weather => weather.main.toLowerCase().includes("rain"))) ? "Rain forecast tomorrow" : "No rain in tomorrow's forecast";
  } catch {
    temp.textContent = "Weather unavailable";
    rain.textContent = "Check your API access and connection, then retry.";
  } finally { button.disabled = false; }
});
