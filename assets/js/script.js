let apiKey = 'd3ddf23d533942a91d17b7f565e673f9';
let city;
let queryURLWeather = `http://api.openweathermap.org/data/2.5/weather`;
let queryURLOneCall = `http://api.openweathermap.org/data/2.5/onecall`;
let queryURLForcast = `http://api.openweathermap.org/data/2.5/forecast/daily`;
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

        fetch(`${queryURLForcast}?q=${city}&cnt={5}&appid=${apiKey}`)
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
        }).then(function() {

            let latitude = weatherData.coord.lat;
            let longitude = weatherData.coord.lon;

            fetch(`${queryURLOneCall}?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error (err);
                }
            })
            .then(function(oneCallData) {
                
                weatherData = oneCallData;
            })
            .catch((err) => {
                // Add feedback for user;
                // Possible city incorrectly entered or not a city
            }).then( function() {
                renderInfo(citName, weatherData, forecastData);
            });
        })
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

    let timeStamp = weather.current.dt;
    let date = new Date(timeStamp * 1000);
    let day =  `${date.getDate()}`;
    let month = `${date.getMonth()+1}`;
    let year = date.getFullYear();
    let todaysDate = ` ${day}/${month}/${year} `;

    // <!-- Displayed information for weather -->
        // <!-- City name, date, and weather icon -->
        $("#cityName").text(`${city} `);
        $("#searchDate").text(todaysDate);
        $("#weatherIcon").attr("src", weather.current.weather.icon);
        // <!-- Temp -->
        $("#cityTemp").text(weather.current.temp);
        // <!-- Wind -->
        $("#cityWind").text(weather.current.wind_speed);
        // <!-- Humidity -->
        $("#cityHimidity").text(weather.current.humidity);
        // <!-- UV Index -->
        $("#cityUVIndex").text(weather.current.uvi);
        
    
    // <!-- 5 day forecase -->
    for (let i = 0; i < forecast.list.length; i++) {
        console.log(forecast.list[i].dt_txt)
    }
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