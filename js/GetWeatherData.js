let activeTempUnit = "C";
let tempC;
let tempF;

async function getWeatherData(url, lat, long) {
  const weatherData = await fetch(url);
  const weatherDataJson = await weatherData.json();
  const current = weatherDataJson.current;
  const daily = weatherDataJson.daily;

  setHighlights([
    current.wind_speed,
    current.humidity,
    current.visibility,
    current.pressure,
  ]);
  
  let cityData = await fetch(`https://api.openweathermap.org/data/2.5/weather?appid=114843591b3cb4652a2b94e65486c00a&units=metric&lang=en&lat=${lat}&lon=${long}`);
  cityData = await cityData.json();
  
  tempC = Math.trunc(current.temp);
  tempF = Math.round(current.temp * (9 / 5) + 32);
  if (activeTempUnit === "C") {
    setCurrentWeather(tempC, current.weather[0].description, cityData.name, cityData.sys.country);
  } else {
    setCurrentWeather(tempF, current.weather[0].description, cityData.name, cityData.sys.country);
  }

  setFutureWeather(daily);
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


function setCurrentWeather(temp, desc, cityName, country) {
  document.querySelector(".CurrentWeather-Value").textContent = temp;
  document.querySelector(".CurrentWeather-Unit").textContent = activeTempUnit;
  document.querySelector(".CurrentWeather-Desc").textContent = desc;
  document.querySelector(".currentWeatherImg-js").setAttribute("src", `images/${desc}.png`);
  document.querySelector(".Location-Address").textContent = cityName + ", " + country;
}


function setFutureWeather(dailyData) {
  // dailyData.forEach(element => {
  //   let unixTime = element.dt;
  //   let date = new Date(unixTime*1000);
  //   console.log(date);
  // });

  // tomorrow is second index of daily data because data starts from current day to current day total 8 days data
  let tomorrow = 1;
  let maxElements = document.querySelectorAll(".FutureCard-MaxTempValue");
  let minElements = document.querySelectorAll(".FutureCard-MinTempValue");
  let futureWeatherImg = document.querySelectorAll(".FutureCard-WeatherImg");
  let futureWeatherDesc = document.querySelectorAll(".FutureCard-Desc");

  let elem = 0;
  for (let i = tomorrow; i <= 5; i++) {
    maxElements[elem].textContent = Math.trunc(dailyData[i].temp.max);
    elem++;
  }
  elem = 0;
  for (let i = tomorrow; i <= 5; i++) {
    minElements[elem].textContent = Math.trunc(dailyData[i].temp.min);
    futureWeatherImg[elem].setAttribute("src", `images/${dailyData[i].weather[0].description}.png`);
    futureWeatherDesc[elem].textContent = dailyData[i].weather[0].description;
    elem++;
  }
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

  // future card dates
  let lastDate = new Date();
  let futureCardDates = document.querySelectorAll(".FutureCard-Date");
  for (let date of futureCardDates) {
    lastDate = new Date(lastDate);
    lastDate.setDate(lastDate.getDate() + 1)
    let customisedDate = lastDate.toString();
    let dateArr = customisedDate.split(" ");
    let outputDate = `${dateArr[0]}, ${+dateArr[2]} ${dateArr[1]}`;
    date.textContent = outputDate;
  }
  futureCardDates[0].textContent = "Tomorrow";
})();


const futureUnits = document.querySelectorAll(".future-temp-unit-js");
const futureValue = document.querySelectorAll(".future-temp-js");
document.querySelector(".switchC").addEventListener("click", () => {
  futureValue.forEach(element => {
    if (activeTempUnit === "F") {
      element.textContent = Math.round((+element.textContent - 32) * 5/9);
    }
  });

  activeTempUnit = "C";
  document.querySelector(".CurrentWeather-Value").textContent = tempC;
  document.querySelector(".CurrentWeather-Unit").textContent = activeTempUnit;

  futureUnits.forEach(element => {
    element.textContent = "C";
  });
});


document.querySelector(".switchF").addEventListener("click", () => {
  futureValue.forEach(element => {
    if (activeTempUnit === "C") {
      element.textContent = Math.round(+element.textContent * (9 / 5) + 32);
    }
  });

  activeTempUnit = "F";
  document.querySelector(".CurrentWeather-Value").textContent = tempF;
  document.querySelector(".CurrentWeather-Unit").textContent = activeTempUnit;

  futureUnits.forEach(element => {
    element.textContent = "F";
  });
});

