// constants that we need in order to collect and display data

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card"); 
const apiKey = "7c1a37dcc8617ef1fe4650e273af97ce";
let history = window.localStorage.getItem("history");
let historyButtons = "";
let buttonContainer = ""
const historyContainer = document.getElementById("history-container");
const forecastData = document.getElementById("forecast");

//gets weather information and sends an error if city is not found.
async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
}

//gets forecast information and at 12pm local time every day from the 
//following api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
async function getForecastData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Network response was not ok: ${errorData.message}`);
  }

  return await response.json();
}

//declares the city value, displays the weather data and stores the city value to history/local storage
weatherForm.addEventListener("submit", async event => {
  event.preventDefault();
  const city = cityInput.value;
  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      displayWeather(weatherData);
      storeHistory(city);
      createHistoryButton(city); // Create and display the history button immediately
      const forecastData = await getForecastData(city);
      displayForecast(forecastData);
    } catch (error) {
      console.error(error);
      displayError("Error fetching weather data. Please try again.");
    }
  } else {
    displayError("Please enter a valid city name.");
  }
});

/**
 * This function creates a history button for the given city and appends it to the history container.
 * @param {string} city - The city for which the history button is to be created.
 */
function createHistoryButton(city) {
  const historyButton = document.createElement("button");
  historyButton.textContent = city;
  historyButton.classList.add("history-button");

  // Add a click event listener to the button
  historyButton.addEventListener("click", async () => {
    try {
      const weatherData = await getWeatherData(city);
      displayWeather(weatherData);
    } catch (error) {
      console.error(error);
      displayError("Error fetching weather data. Please try again.");
    }
  });

  // Append the button to the history container
  historyContainer.appendChild(historyButton);
}

function storeHistory(city) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("history", JSON.stringify(history));
  } else {
    console.log('City already in history, not adding');
  }
}
// Get the history data from local storage
const historyData = JSON.parse(localStorage.getItem("history"));

// Check if there is any history data
if (historyData) {
// Get the container element where the history buttons will be added
const historyContainer = document.getElementById("history-container");

// Loop through the history data and create a button for each item
historyData.forEach(item => {
  // Create a new button element
  const historyButton = document.createElement("button");
  historyButton.textContent = item;
  historyButton.classList.add("history-button");

  // Add a click event listener to the button
  historyButton.addEventListener("click", async () => {
    try {
      // Call the getWeatherData function with the city from the button
      const weatherData = await getWeatherData(item);
      displayWeather(weatherData);
    } catch (error) {
      console.error(error);
      displayError("Error fetching weather data. Please try again.");
    }
  });

  // Append the button to the history container and capitalize it
  historyButton.textContent = item.charAt(0).toUpperCase() + item.slice(1);
  historyContainer.appendChild(historyButton);
});
} else {
// If there is no history data, you could display a message or do something else
console.log("No history data found in local storage.");
}

/**
 * This function creates history buttons based on the cities stored in the browser's local storage.
 */


function displayWeather (data) {
  const {name: city,
        main: {temp, humidity},
        weather: [{description, id}]} = data;
   card.textContent = "";
   card.style.display = "flex";  
   
   const cityDisplay = document.createElement("h1");
   const tempDisplay = document.createElement("p");
   const humidtyDisplay = document.createElement("p");
   const descriptionDisplay = document.createElement("p");
   const emojiDisplay = document.createElement("p");

   cityDisplay.textContent = city;
   tempDisplay.textContent = `${((temp - 273.15) * (9/5) + 32).toFixed(0)}°F`;
   humidtyDisplay.textContent = `Humidity: ${humidity}%`;
   descriptionDisplay.textContent = description;
   emojiDisplay.textContent = getEmoji(id);

   cityDisplay.classList.add("cityDisplay");
   tempDisplay.classList.add("tempDisplay");
   humidtyDisplay.classList.add("humidtyDisplay");
   descriptionDisplay.classList.add("descriptionDisplay");
   emojiDisplay.classList.add("emojiDisplay");

      card.appendChild(cityDisplay);
      card.appendChild(tempDisplay);
      card.appendChild(humidtyDisplay);
      card.appendChild(descriptionDisplay);
      card.appendChild(emojiDisplay);
      
  }
  //create a 5 day visual display of the forecast from the api call that is identical to the displayweather function
  //however it displays 5 days at the same exact time every day 12pm local time. 

  function displayForecast(data) {
    const forecastData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    const forecastContainer = document.getElementById("forecast-container");
    forecastContainer.textContent = "";
  
    forecastData.forEach(day => {
      const { main: { temp, humidity }, weather: [{ description, id }], dt_txt } = day;
  
      // Create a container for the day
      const dayContainer = document.createElement("div");
      dayContainer.classList.add("day-container");
  
      // Create elements for date, temperature, humidity, description, and emoji
      const dateDisplay = document.createElement("p");
      const tempDisplay = document.createElement("p");
      const humidityDisplay = document.createElement("p");
      const descriptionDisplay = document.createElement("p");
      const emojiDisplay = document.createElement("p");
      const date = new Date(dt_txt.replace(' ', 'T'));
      const options = { weekday: 'short', month: 'numeric', day: 'numeric' };
      const formattedDate = date.toLocaleString('en-US', options);
      dateDisplay.textContent = formattedDate;
  
      tempDisplay.textContent = `${temp.toFixed(0)}°F`;
      humidityDisplay.textContent = `Humidity: ${humidity}%`;
      descriptionDisplay.textContent = description;
      emojiDisplay.textContent = getEmoji(id);
  
      // Append the elements to the day container
      dayContainer.appendChild(dateDisplay);
      dayContainer.appendChild(tempDisplay);
      dayContainer.appendChild(humidityDisplay);
      dayContainer.appendChild(descriptionDisplay);
      dayContainer.appendChild(emojiDisplay);
  
      // Append the day container to the forecast container
      forecastContainer.appendChild(dayContainer);
    });
  }
  //5 day forecast should display in the "forecast" section. IT should display
  //12pm local time forecast for each day starting with today
  


  
 

function getEmoji (weatherId) {
  switch(true) {
    case (weatherId >= 200 && weatherId <300):
      return "⛈️";
    case (weatherId >= 300 && weatherId <600):
      return "🌧️";
    case (weatherId >= 600 && weatherId <700):
      return "❄️";
    case (weatherId >= 700 && weatherId <800):
        return "⛈️";  
    case (weatherId === 800):
      return "☀️";
    case (weatherId >= 801 && weatherId <810):
        return "☁️";
    default: 
    return "⚠️"

  }

}
//creates an error display and displays it if an error is returned444
function displayError (message) {
  const errorDisplay = document.createElement("p")
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}
// create a function to display history in local storage in the "button-container" in the html page
 