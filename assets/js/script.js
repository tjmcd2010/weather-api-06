// constants that we need in order to collect and display data

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card"); 
const buttonContainer = document.querySelector(".buttonContainer");
const apiKey = "7c1a37dcc8617ef1fe4650e273af97ce";

//gets weather information and sends an error if city is not found.
async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
}



weatherForm.addEventListener("submit", async event => {
  event.preventDefault();
  const city = cityInput.value;
  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      displayWeather(weatherData);
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

  
  // Create a search history with buttons that will allow you to view previous clicks
  function createHistoryButtons() {
    buttonContainer.textContent = "";
    let history = window.localStorage.getItem("history");
    if (history) {
      history = JSON.parse(history);
    } else {
      history = [];
    }

    history.forEach(function (city) {
      const button = document.createElement("button");
      button.textContent = city;
      button.classList.add("btn btn-secondary");
      button.setAttribute("data-city", city);     
      buttonContainer.appendChild(button);
    })
  }

  //store history in local storage and display them in a clickable list. 
  
  function storeHistory(city) {
    console.log('Storing city in history:', city);
    if (history) {
      history = JSON.parse(history);
    } else {
      history = [];
    }
    
    
    // Get the previously stored cities from local storage
    let history = JSON.parse(window.localStorage.getItem("history")) || [];
    console.log('Current history:', history);
  
    // Check if the city is already in the history
    if (!history.includes(city)) {
      // If not, add the city to the history
      history.push(city);
      // Save the updated history to local storage
      window.localStorage.setItem("history", JSON.stringify(history));
      console.log('Updated history:', history);
    } else {
      console.log('City already in history, not adding');
    }
  }


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
console.log('city', cityInput.value);