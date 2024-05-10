const requestUrl = "https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=44.34&lon=10.99&appid=7c1a37dcc8617ef1fe4650e273af97ce";
const apiKey = "7c1a37dcc8617ef1fe4650e273af97ce"
const listEl = document.getElementById("myData");

//add search paraemters to search for a city that will fetch weather information
const searchParams = new URLSearchParams(window.location.search);
const city = searchParams.get("city");
const country = searchParams.get("country");



fetch(requestUrl)
  .then(function (response) {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(function(data) {
    if (data.weather) {
      let cityName = data.name;
      for (let i = 0; i < data.weather.length; i++) {
        let listItem = document.createElement("li");
        //list the city name, convert Kelvin temperature in Farenheit and the weather description
        listItem.textContent = `${cityName}: ${Math.round(data.main.temp)} F, ${data.weather[i].description}`;
        listEl.appendChild(listItem);
      }
    } else {
      const errorMessage = "An error occurred while fetching data. Please try again later.";
      listEl.textContent = errorMessage;
    }
  })
  .catch(function (error) {
    const errorMessage = "An error occurred while fetching data. Please try again later.";
    listEl.textContent = errorMessage;
    console.error("Error:", error);
  });

    
