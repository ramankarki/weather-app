const searchForPlace = document.querySelector(".search-for-place-js");
const searchForPlaceInput = document.querySelector(".SearchForPlacesInput-js");
const currentWeather = document.querySelector(".CurrentWeather-js");
const exitBtn = document.querySelector(".exit-icon");

searchForPlaceInput.style.left = `-${currentWeather.clientWidth}px`;

searchForPlace.addEventListener("click", () => {
  searchForPlaceInput.classList.add("SearchForPlacesInput-transition");
  searchForPlaceInput.style.left = 0;
})

exitBtn.addEventListener("click", () => {
  searchForPlaceInput.style.left = `-${currentWeather.clientWidth}px`;
});

