// Replace YOUR_API_KEY with your actual API key from OpenWeatherMap
const API_KEY = "855c0f73673570cfc1f4feec37169e3b";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Select the relevant DOM elements
const $searchInput = $("#search-input");
const $searchButton = $("#search-button");
const $currentWeather = $("#current-weather");
const $forecast = $("#forecast");

// Add event listener to search button
$searchButton.on("click", function() {
  const location = $searchInput.val();
  if (location) {
    search(location);
  }
});

// Add event listener to search input for pressing Enter key
$searchInput.on("keyup", function(event) {
  if (event.key === "Enter") {
    const location = $searchInput.val();
    if (location) {
      search(location);
    }
  }
});

// Function to search for weather data for a location
function search(location) {
  const weatherUrl = `${BASE_URL}/weather?q=${location}&appid=${API_KEY}&units=imperial`;
  const forecastUrl = `${BASE_URL}/forecast?q=${location}&appid=${API_KEY}&units=imperial`;

  $.when(
    $.get(weatherUrl),
    $.get(forecastUrl)
  ).done(function(weatherData, forecastData) {
    // Extract the relevant data from the response
    const currentWeatherData = weatherData[0];
    const forecastWeatherData = forecastData[0].list.filter(function(item, index) {
      return index % 8 === 0;
    });

    // Display the current weather data
    const currentWeatherHtml = `
      <h2>${currentWeatherData.name}, ${currentWeatherData.sys.country}</h2>
      <div class="weather-icon">
        <img src="https://openweathermap.org/img/w/${currentWeatherData.weather[0].icon}.png" alt="${currentWeatherData.weather[0].description}">
      </div>
      <div class="temperature">${Math.round(currentWeatherData.main.temp)}&deg;F</div>
      <div class="description">${currentWeatherData.weather[0].description}</div>
    `;
    $currentWeather.html(currentWeatherHtml);

    // Display the forecast data
    let forecastHtml = "";
    forecastWeatherData.forEach(function(forecastItem) {
      const date = new Date(forecastItem.dt * 1000);
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
      forecastHtml += `
        <div class="forecast-item">
          <div class="day-of-week">${dayOfWeek}</div>
          <div class="weather-icon">
            <img src="https://openweathermap.org/img/w/${forecastItem.weather[0].icon}.png" alt="${forecastItem.weather[0].description}">
          </div>
          <div class="temperature">${Math.round(forecastItem.main.temp)}&deg;F</div>
          <div class="description">${forecastItem.weather[0].description}</div>
        </div>
      `;
    });
    $forecast.html(forecastHtml);
  }).fail(function() {
    alert("An error occurred while retrieving weather data. Please try again.");
  });
}
