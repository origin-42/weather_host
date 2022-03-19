let apiKey = 'd3ddf23d533942a91d17b7f565e673f9';
let city;
let queryURLWeather = `http://api.openweathermap.org/data/2.5/weather`;
let queryURLForcast = `http://api.openweathermap.org/data/2.5/forecast`;
const getTodaysDate = () => {
    let todaysDate = new Date();
    return todaysDate;
}


const searchHistory = {};

// Update city and call query with fetch
const queryWeather = (citName) => {

    // Collect data
    let weatherData;
    let forecastData;

    fetch(`${queryURLWeather}?q=${city}&appid=${apiKey}`)
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

        fetch(`${queryURLForcast}?q=${city}&appid=${apiKey}`)
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
            renderInfo(citName, weatherData, forecastData);
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

const renderInfo = (city, weather, forecast) => {
    console.log(weather.main.temp)

    let timeStamp = weather.dt;
    let date = new Date(timeStamp * 1000);
    let day =  date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear();
    let todaysDate = `${day} ${month} ${year}`;

    // <!-- Displayed information for weather -->
        // <!-- City name, date, and weather icon -->
        $("#cityName").text(city);
        $("#searchDate").text(todaysDate);
        $("#weatherIcon").attr("src", weather.weather.icon);
        // <!-- Temp -->
        $("#cityTemp").text(weather.main.temp);
        // <!-- Wind -->
        $("#cityWind").text(weather.wind.speed);
        // <!-- Humidity -->
        $("#cityHimidity").text(weather.main.humidity);
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
        
    searchHistory["cities"] = {"city": city, "weatherData": weather, "forecastData": forecast,}

}

// Event Listeners
$("#citysearch_submit").on('click', sanitiseEntry);