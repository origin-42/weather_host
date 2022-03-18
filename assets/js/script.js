let apiKey = 'd3ddf23d533942a91d17b7f565e673f9';
let city = 'Western Australia';
let queryURLWeather = `http://api.openweathermap.org/data/2.5/weather`;
let queryURLForcast = `http://api.openweathermap.org/data/2.5/forecast`;

const searchHistory = {};

// Update city and call query with fetch
const queryWeather = (givenCity) => {

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
    })
    .catch((err) => {
        // Add feedback for user;
        // Possible city incorrectly entered or not a city
    });

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
    });

    // Call event handler success function. Which will;
    saveData(givenCity, weatherData, forecastData);
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

    addSearchHistory(value);
    
} 

const addSearchHistory = (city) => {

}

// Event Listeners
$("#citysearch_submit").on('click', sanitiseEntry);