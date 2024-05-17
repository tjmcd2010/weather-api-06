// constants that we need in order to collect and display data

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card"); 
const apiKey = "7c1a37dcc8617ef1fe4650e273af97ce";
let history = window.localStorage.getItem("history");
let historyButtons = "";
let buttonContainer = ""

//gets weather information and sends an error if city is not found.
async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error('Network response was not ok');
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
    storeHistory(city) 
    // create history button and then display      
    } 

    catch (error) {
      console.error(error);
      displayError("Error fetching weather data. Please try again.");
    }
  } else {
    displayError("Please enter a valid city name.");
  }
});

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
  //create a 5 day visual display of the forecast from the api call

  
  //function createHistoryButtons() 
  

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

    // Append the button to the history container
    historyContainer.appendChild(historyButton);
  });
} else {
  // If there is no history data, you could display a message or do something else
  console.log("No history data found in local storage.");
}

  /**
   * This function creates history buttons based on the cities stored in the browser's local storage.
   */
  
 
  

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
 