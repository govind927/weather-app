const apiKey = "67b92f0af5416edbfe58458f502b0a31";

function fetchWeather(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => displayWeather(data))
    .catch((err) => alert("City not found!"));

  fetchForecast(city);
}

function displayWeather(data) {
  const { name } = data;
  const { icon, description } = data.weather[0];
  const { temp, humidity } = data.main;
  const { speed } = data.wind;

  document.querySelector(".city").innerText = `Weather in ${name}`;
  document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  document.querySelector(".description").innerText = description;
  animateTemperature(temp);
  document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
  document.querySelector(".wind").innerText = `Wind speed: ${speed} km/h`;
  document.querySelector(".weather").classList.remove("loading");

  document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${name},weather')`;
}

function fetchForecast(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => displayForecast(data));
}

function displayForecast(data) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  const daily = {};

  // Collect forecast data near 12:00 PM for each day
  data.list.forEach(entry => {
    const date = entry.dt_txt.split(" ")[0];
    const time = entry.dt_txt.split(" ")[1];

    // Store all entries for each day
    if (!daily[date]) {
      daily[date] = [];
    }
    daily[date].push(entry);
  });

  // Take only the next 5 days (excluding today if needed)
  const dates = Object.keys(daily).slice(0, 5);

  dates.forEach(date => {
    const dayEntries = daily[date];

    // Pick closest to 12 PM for icon/description
    let noonEntry = dayEntries.reduce((prev, curr) => {
      const prevHour = parseInt(prev.dt_txt.split(" ")[1].split(":")[0]);
      const currHour = parseInt(curr.dt_txt.split(" ")[1].split(":")[0]);
      return Math.abs(currHour - 12) < Math.abs(prevHour - 12) ? curr : prev;
    });

    // Calculate min/max temp, average humidity/wind
    let minTemp = Infinity, maxTemp = -Infinity, humiditySum = 0, windSum = 0;
    dayEntries.forEach(e => {
      minTemp = Math.min(minTemp, e.main.temp_min);
      maxTemp = Math.max(maxTemp, e.main.temp_max);
      humiditySum += e.main.humidity;
      windSum += e.wind.speed;
    });

    const avgHumidity = Math.round(humiditySum / dayEntries.length);
    const avgWind = Math.round(windSum / dayEntries.length);

    const icon = noonEntry.weather[0].icon;
    const desc = noonEntry.weather[0].description;
    const dayShort = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

    const dayElem = document.createElement("div");
    dayElem.className = "forecast-day";
    dayElem.innerHTML = `
      <h4>${dayShort}</h4>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
      <p style="margin: 4px 0;"><strong>${desc}</strong></p>
      <p>🌡️ ${Math.round(minTemp)}° / ${Math.round(maxTemp)}°C</p>
      <p>💧 Humidity: ${avgHumidity}%</p>
      <p>🌬️ Wind: ${avgWind} km/h</p>
    `;
    forecastContainer.appendChild(dayElem);
  });
}


function animateTemperature(finalTemp) {
  const tempElement = document.querySelector(".temp");
  let currentTemp = 0;
  const duration = 1000; // in ms
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = finalTemp / steps;

  const tempInterval = setInterval(() => {
    currentTemp += increment;
    if (currentTemp >= finalTemp) {
      tempElement.innerText = `${Math.round(finalTemp)}°C`;
      clearInterval(tempInterval);
    } else {
      tempElement.innerText = `${Math.round(currentTemp)}°C`;
    }
  }, stepTime);
}


document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.querySelector(".search-bar").value;
  fetchWeather(city);
});

document.querySelector(".search-bar").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = e.target.value;
    fetchWeather(city);
  }
});

// Dark mode toggle
document.getElementById("darkToggle").addEventListener("change", (e) => {
  document.body.classList.toggle("dark-mode", e.target.checked);
});

fetchWeather("Chandigarh");
