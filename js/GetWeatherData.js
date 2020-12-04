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
  
  tempC = Math.round(current.temp);
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
  document.querySelector(".currentWeatherImg-js").setAttribute("src", `images/${desc}.svg`);
  document.querySelector(".Location-Address").textContent = cityName;
  if (country) {
    document.querySelector(".Location-Address").textContent = cityName + ", " + country;
  }
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
    maxElements[elem].textContent = Math.round(dailyData[i].temp.max);
    elem++;
  }
  elem = 0;
  for (let i = tomorrow; i <= 5; i++) {
    minElements[elem].textContent = Math.round(dailyData[i].temp.min);
    futureWeatherImg[elem].setAttribute("src", `images/${dailyData[i].weather[0].description}.svg`);
    futureWeatherDesc[elem].textContent = dailyData[i].weather[0].description;
    elem++;
  }
}

// ---
async function searchCity() {
  let inputCity = document.querySelector(".Form-InputField").value;
  document.querySelector(".Form-InputField").value = "";

  let cityData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=114843591b3cb4652a2b94e65486c00a&units=metric&lang=en`);
  cityData = await cityData.json();

  if (cityData.cod !== "404") {
    document.querySelector(".recent-cities-name").classList.add("recent-cities-name-visible");
    addRecentCitySearch(inputCity);
    delCitiesItem();
    let urlNew = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityData.coord.lat}&lon=${cityData.coord.lon}&exclude=minutely,hourly,alerts&appid=114843591b3cb4652a2b94e65486c00a&units=metric&lang=en`;
    getWeatherData(urlNew, cityData.coord.lat, cityData.coord.lon);
    searchForPlaceInput.style.left = `-${currentWeather.clientWidth}px`;
    document.querySelector(".errorInput").classList.remove("errorInput-visible");
  } else {
    document.querySelector(".errorInput").classList.add("errorInput-visible");
  }
}

function addRecentCitySearch(inputValue) {
  let citiesItem = document.createElement("div");
  citiesItem.classList.add("Cities-Item");
  let span = document.createElement("span");
  span.classList.add("Cities-Name");
  span.textContent = inputValue;
  let img = document.createElement("img");
  img.src = "images/right-angle-icon.svg";
  img.alt = "right arrow icon";
  img.classList.add("right-angle-icon");
  citiesItem.appendChild(span);
  citiesItem.appendChild(img);
  document.querySelector(".Cities").prepend(citiesItem);
  switchBackRecent();
}

function delCitiesItem () {
  let cities = document.querySelectorAll(".Cities-Item");
  if (cities.length > 5) {
    cities[cities.length - 1].parentNode.removeChild(cities[cities.length - 1]);
  }
}

// submit btn event listener
document.querySelector(".Form-SubmitBtn").addEventListener("click", searchCity);

// auto focus to input field
document.querySelector(".search-for-place-js").addEventListener("click", () => {
  document.querySelector(".Form-InputField").focus();
});

// keyboard event listener
let inputField = document.querySelector(".Form-InputField");
inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && inputField.value !== "") {
    searchCity();
  }
});

// short-cut key to open search input field
document.addEventListener('keydown', function(event) {
  if (event.altKey && event.key === 's') {
    searchForPlaceInput.classList.add("SearchForPlacesInput-transition");
    searchForPlaceInput.style.left = 0;
    document.querySelector(".Form-InputField").focus();
  }
});


// get data directly clicking previous searches
function switchBackRecent() {
  let cities = document.querySelectorAll(".Cities-Item");
  cities.forEach(element => {
    element.addEventListener("click", () => {
      document.querySelector(".Form-InputField").value = element.textContent;
      console.log(element.textContent);
      searchCity();
    });
  });
}

// ---

navigator.geolocation.getCurrentPosition((position) => {
  let lat, long;
  lat = position.coords.latitude;
  long = position.coords.longitude;

  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly,alerts&appid=114843591b3cb4652a2b94e65486c00a&units=metric&lang=en`;

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

// celcius button click event
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

// fahrenheit button click event
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

