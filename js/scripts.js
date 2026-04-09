const apiKey = "b19afa29f7ec465b9ef0baf20271cd35";
const apiCountryURL = "https://flagsapi.com";

const cityInput = document.querySelector('#city-input');
const searchBtn = document.querySelector('#search');

const cityElement = document.querySelector('#city');
const tempElement = document.querySelector('#temperature span');
const descElement = document.querySelector('#description');
const weatherIconElement = document.querySelector('#weather-icon');
const countryElement = document.querySelector('#country');
const humidityElement = document.querySelector('#humidity span');
const windElement = document.querySelector('#wind span');

const weatherContainer = document.querySelector("#weather-data");
const detailsContainer = document.querySelector("#details-container");
const mapContainer = document.querySelector("#map");

let map;
let marker;

// ✅ FUNÇÃO GLOBAL (CORRETO)
const changeBackground = (weather) => {
  const body = document.body;

  body.className = "";

  switch (weather) {
    case "Clear":
      body.classList.add("clear");
      break;

    case "Clouds":
      body.classList.add("clouds");
      break;

    case "Rain":
      body.classList.add("rain");
      break;

    case "Drizzle":
      body.classList.add("drizzle");
      break;

    case "Thunderstorm":
      body.classList.add("thunderstorm");
      break;

    case "Snow":
      body.classList.add("snow");
      break;

    default:
      body.classList.add("atmosphere");
  }
};

const getWeatherData = async (city) => {
  const apiWeatherURl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

  const res = await fetch(apiWeatherURl);
  const data = await res.json();

  return data;
};

const showMap = (lat, lon, city) => {

  if (map) {
    map.setView([lat, lon], 10);

    marker.setLatLng([lat, lon])
      .bindPopup(city)
      .openPopup();

    return;
  }

  map = L.map('map').setView([lat, lon], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  marker = L.marker([lat, lon])
    .addTo(map)
    .bindPopup(city)
    .openPopup();
};

const showWeatherData = async (city) => {
  const data = await getWeatherData(city);

  if (data.cod === "404") {
    alert("Cidade não encontrada!");
    return;
  }

  // ✅ AGORA FUNCIONA
  changeBackground(data.weather[0].main);

  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;

  weatherIconElement.src =
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  countryElement.src =
    `${apiCountryURL}/${data.sys.country}/flat/64.png`;

  humidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed} Km/h`;

  const lat = data.coord.lat;
  const lon = data.coord.lon;

  showMap(lat, lon, data.name);

  weatherContainer.classList.remove("hide");
  detailsContainer.classList.remove("hide");
  mapContainer.classList.remove("hide");
};

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const city = cityInput.value;
  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const city = e.target.value;
    showWeatherData(city);
  }
});