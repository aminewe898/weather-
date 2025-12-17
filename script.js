const apiKey = "1972821c756a41afb57d3af6b09eb123";
const city = "Reus";

// ⏰ Current time
function updateTime() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
  document.getElementById("time").textContent = `⏰ ${time}`;
}
updateTime();
setInterval(updateTime, 60000);

// 🌡️ Current weather
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("temp").textContent =
      data.main.temp + " °C";
  });

// 🌧️ Tomorrow rain check (forecast)
fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.getDate();

    const rainTomorrow = data.list.some(item => {
      const itemDate = new Date(item.dt * 1000);
      return (
        itemDate.getDate() === tomorrowDay &&
        item.weather[0].main.toLowerCase().includes("rain")
      );
    });

    document.getElementById("rain").textContent =
      rainTomorrow ? "🌧️ It will rain tomorrow" : "☀️ No rain tomorrow";
  })
  .catch(() => {
    document.getElementById("rain").textContent =
      "Error loading forecast 😵";
  });
