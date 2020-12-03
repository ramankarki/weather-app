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

const switchC = document.querySelector(".switchC");
const switchF = document.querySelector(".switchF");
switchC.addEventListener("click", () => {
  switchF.classList.remove("switchActive");
  switchC.classList.add("switchActive");
});
switchF.addEventListener("click", () => {
  switchC.classList.remove("switchActive");
  switchF.classList.add("switchActive");
});

