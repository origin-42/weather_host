let apiKey = 'd3ddf23d533942a91d17b7f565e673f9';
let city;
let queryURLWeather = `http://api.openweathermap.org/data/2.5/weather`;
let queryURLForcast = `http://api.openweathermap.org/data/2.5/forecast`;

const searchHistory = {};

// Update city and call query with fetch
const queryWeather = (citName) => {

    // Collect data
    let weatherData;
    let forecastData;

    fetch(`${queryURLForcast}?q=${city}&appid=${apiKey}`)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error (err);
        }
    })
    .then(function (weatherSuccessData) {
        weatherData = weatherSuccessData;
    }).then(function() {

        fetch(`${queryURLWeather}?q=${city}&appid=${apiKey}`)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error (err);
            }
        })
        .then(function (forecastSuccessData) {
            forecastData = forecastSuccessData;
        })
        .catch((err) => {
            // Add feedback for user;
            // Possible city incorrectly entered or not a city
        }).then( function() {
            addSearchHistory(citName, weatherData, forecastData);
        });
    })
    .catch((err) => {
        // Add feedback for user;
        // Possible city incorrectly entered or not a city
    });

    

    // Call event handler success function. Which will;
    
    // take the data, call another function to handle adding that search into a history object
    // Call function to extract from that object and display it's info in correct formatting.
}


// Sanitise user entry
const sanitiseEntry = (event) => {
    event.preventDefault();

    let value = $("#citysearch").val()
    let restrictions = /^[-a-zA-Z]+(\s+[-a-zA-Z]+)*$/;

    if (value.match(restrictions)) {
        // Gives sanitised value;
        city = value;
    } else {
        // Add feedback for user;
    }

    queryWeather(value);
    
} 

const addSearchHistory = (city, weather, forecast) => {

    // <!-- Displayed information for weather -->
        // <!-- City name, date, and weather icon -->
        // <!-- Temp -->
        // <!-- Wind -->
        // <!-- Humidity -->
        // <!-- UV Index -->
    
    // <!-- 5 day forecase -->
        // <!-- Day 1 -->
            // <!-- Date -->
            // <!-- Weather Rep Icon -->
            // <!-- Temp -->
            // <!-- Wind -->
            // <!-- Humidity -->
        // <!-- Day 2 -->
        // <!-- Day 3 -->
        // <!-- Day 4 -->
        // <!-- Day 5 -->
        
    searchHistory["cities"] = {"city": city, "weather": weather, "forecast": forecast,}

}

// Event Listeners
$("#citysearch_submit").on('click', sanitiseEntry);