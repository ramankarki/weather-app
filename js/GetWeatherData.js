let activeTempUnit = "c";
let temp;

async function getWeatherData(url, lat, long) {
  const weatherData = await fetch(url);
  const weatherDataJson = await weatherData.json();
  const current = weatherDataJson.current;
  const daily = weatherDataJson.daily;

  console.log(current, daily);
  setHighlights([
    current.wind_speed,
    current.humidity,
    current.visibility,
    current.pressure,
  ]);
  
  let cityData = await fetch(`https://api.openweathermap.org/data/2.5/weather?appid=114843591b3cb4652a2b94e65486c00a&units=metric&lang=en&lat=${lat}&lon=${long}`);
  cityData = await cityData.json();
  console.log(cityData.name);
  
  setCurrentWeather(current.temp, current.weather[0].description, cityData.name);
}


function setHighlights(highlights) {
  const windSpeed = Math.round(highlights[0] * 2.236936);
  const humidity = highlights[1];
  const visibility = highlights[2] * 0.00062;
  const pressure = highlights[3];

  document.querySelector(".Highlights-WindValueNum").textContent = windSpeed;
  document.querySelector(".Highlights-HumidityPerValue").textContent = humidity;
  document.querySelector(
    ".humidityIndicatorLevel"
  ).style.width = `${humidity}%`;
  document.querySelector(
    ".Highlights-VisibilityDistanceValue"
  ).textContent = visibility;
  document.querySelector(".Highlights-AirPressureValue").textContent = pressure;
}


function setCurrentWeather(tempC, desc, cityName) {
  if (activeTempUnit !== "c") {
    temp = Math.round(tempC * (9 / 5) + 32);
  } else {
    temp = Math.trunc(tempC);
  }
  document.querySelector(".CurrentWeather-Value").textContent = temp;
  document.querySelector(".CurrentWeather-Desc").textContent = desc;
  document.querySelector(".currentWeatherImg-js").setAttribute("src", `images/${desc}.png`);
  document.querySelector(".Location-Address").textContent = cityName;
}

navigator.geolocation.getCurrentPosition((position) => {
  let lat, long;
  lat = position.coords.latitude;
  long = position.coords.longitude;

  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly,alerts&appid=114843591b3cb4652a2b94e65486c00a&units=metric&lang=en`;

  // fetch()
  //   .then((response) => response.json())
  //   .then((json) => console.log(json));

  getWeatherData(url, lat, long);
});

// set date
(function () {
  const date = new Date().toString();
  const dateArr = date.split(" ");
  let outputDate = `${dateArr[0]}, ${+dateArr[2]} ${dateArr[1]}`;
  document.querySelector(".date-js").textContent = outputDate;
})();
