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
  document.querySelector(".temp").innerText = `${temp}°C`;
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

  data.list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    if (!daily[date]) {
      daily[date] = entry;
    }
  });

  const days = Object.keys(daily).slice(0, 5); // limit to 5 days

  days.forEach((date) => {
    const entry = daily[date];
    const dayElem = document.createElement("div");
    dayElem.className = "forecast-day";
    dayElem.innerHTML = `
      <h4>${new Date(date).toDateString().slice(0, 3)}</h4>
      <img src="https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png" />
      <p>${Math.round(entry.main.temp)}°C</p>
    `;
    forecastContainer.appendChild(dayElem);
  });
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

fetchWeather("Patna");
