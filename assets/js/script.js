let apiKey = 'd3ddf23d533942a91d17b7f565e673f9';
let city;
let queryURLOneCall = `https://api.openweathermap.org/data/2.5/onecall`;
let getCoords = `https://api.openweathermap.org/data/2.5/weather`;
let iconURL = `https://openweathermap.org/img/wn/`;

const getTodaysDate = () => {
    let todaysDate = new Date();
    return todaysDate;
}


let searchHistory = [];
if (JSON.parse(localStorage.getItem("searchHistory"))) {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory")); 

    $("#cities-wrapper").empty();
    searchHistory.forEach(city => {
        let button = $(`<button id="${city}">`);
        $("#cities-wrapper").append(button);
        $(`#${city}`).addClass("col citySearch bg-info bg-gradient text-center rounded text-light mb-2");
        $(`#${city}`).text(city);
        $(`#${city}`).on('click', function() {
            $("#citysearch").val(`${city}`);
            queryWeather(city)
        });
    })
}


// Update city and call query with fetch
const queryWeather = (citName) => {
    city = citName;

    // Collect data
    let weatherData;

    fetch(`${getCoords}?q=${city}&appid=${apiKey}`)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error (err);
        }
    })
    .then(function (weatherSuccessData) {
        weatherData = weatherSuccessData;
        let lat = weatherData.coord.lat;
        let lon = weatherData.coord.lon;

        fetch(`${queryURLOneCall}?lat=${lat}&lon=${lon}&units={imperial}&appid=${apiKey}`)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error (err);
            }
        })
        .then(function(oneCallSuccessData) {
            weatherData = oneCallSuccessData;
            renderInfo(citName, weatherData);
            console.log(citName, oneCallSuccessData)
        })
        .catch((err) => {
            // Add feedback for user;
            // Possible city incorrectly entered or not a city
        });
    })
    .catch((err) => {
        // Add feedback for user;
        // Possible city incorrectly entered or not a city
    });
    
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

const renderInfo = (city, weather) => {
    const uppercaseWords = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());
    city = uppercaseWords(city)

    // <!-- Displayed information for weather -->
        // <!-- City name, date, and weather icon -->
        $("#cityName").text(`${city} `);
        $("#searchDate").text(`(${convertUnix(weather.current.dt)})`);
        $("#weatherIcon").attr("src", `${iconURL}${weather.current.weather[0].icon}@2x.png`);
        // <!-- Temp -->
        $("#cityTemp").text(`Temperature: ${weather.current.temp}`);
        // <!-- Wind -->
        $("#cityWind").text(`Wind Speed: ${weather.current.wind_speed}`);
        // <!-- Humidity -->
        $("#cityHimidity").text(`Humidity: ${weather.current.humidity}`);
        // <!-- UV Index -->
        $("#cityUVIndex").text(`UV Index: `);
        $("#uvBackground").text(`${weather.current.uvi}`);
        $("#uvBackground").addClass("rounded px-3 text-light");
        $("#uvBackground").removeClass("bg-danger bg-warning bg-success");

        if (weather.current.uvi > 7) {
            $("#uvBackground").addClass("bg-danger");
        } else if (weather.current.uvi > 2) {
            $("#uvBackground").addClass("bg-warning");
        } else if (weather.current.uvi < 3) {
            $("#uvBackground").addClass("bg-success");
        }

        
        
    let childArray = $("#searchForecast").children().children()
    
    $(`#${childArray[0].id}`).empty();
    $(`#${childArray[0].id}`).append(`<h5 class="card-title">${convertUnix(weather.daily[1].dt)}</h5>`);
    $(`#${childArray[0].id}`).append(`<img src="${iconURL}${weather.daily[1].weather[0].icon}@2x.png" class="card-text"></img>`);
    $(`#${childArray[0].id}`).append(`<p class="card-text">Temp: ${weather.daily[1].temp.day}</p>`);
    $(`#${childArray[0].id}`).append(`<p class="card-text">Wind: ${weather.daily[1].wind_speed}</p>`);
    $(`#${childArray[0].id}`).append(`<p class="card-text">Humidity: ${weather.daily[1].humidity}</p>`);

    $(`#${childArray[1].id}`).empty();
    $(`#${childArray[1].id}`).append(`<h5 class="card-title">${convertUnix(weather.daily[2].dt)}</h5>`);
    $(`#${childArray[1].id}`).append(`<img src="${iconURL}${weather.daily[2].weather[0].icon}@2x.png" class="card-text"></img>`);
    $(`#${childArray[1].id}`).append(`<p class="card-text">Temp: ${weather.daily[2].temp.day}</p>`);
    $(`#${childArray[1].id}`).append(`<p class="card-text">Wind: ${weather.daily[2].wind_speed}</p>`);
    $(`#${childArray[1].id}`).append(`<p class="card-text">Humidity: ${weather.daily[2].humidity}</p>`);

    $(`#${childArray[2].id}`).empty();
    $(`#${childArray[2].id}`).append(`<h5 class="card-title">${convertUnix(weather.daily[3].dt)}</h5>`);
    $(`#${childArray[2].id}`).append(`<img src="${iconURL}${weather.daily[3].weather[0].icon}@2x.png" class="card-text"></img>`);
    $(`#${childArray[2].id}`).append(`<p class="card-text">Temp: ${weather.daily[3].temp.day}</p>`);
    $(`#${childArray[2].id}`).append(`<p class="card-text">Wind: ${weather.daily[3].wind_speed}</p>`);
    $(`#${childArray[2].id}`).append(`<p class="card-text">Humidity: ${weather.daily[3].humidity}</p>`);

    $(`#${childArray[3].id}`).empty();
    $(`#${childArray[3].id}`).append(`<h5 class="card-title">${convertUnix(weather.daily[4].dt)}</h5>`);
    $(`#${childArray[3].id}`).append(`<img src="${iconURL}${weather.daily[4].weather[0].icon}@2x.png" class="card-text"></img>`);
    $(`#${childArray[3].id}`).append(`<p class="card-text">Temp: ${weather.daily[4].temp.day}</p>`);
    $(`#${childArray[3].id}`).append(`<p class="card-text">Wind: ${weather.daily[4].wind_speed}</p>`);
    $(`#${childArray[3].id}`).append(`<p class="card-text">Humidity: ${weather.daily[4].humidity}</p>`);

    $(`#${childArray[4].id}`).empty();
    $(`#${childArray[4].id}`).append(`<h5 class="card-title">${convertUnix(weather.daily[5].dt)}</h5>`);
    $(`#${childArray[4].id}`).append(`<img src="${iconURL}${weather.daily[5].weather[0].icon}@2x.png" class="card-text"></img>`);
    $(`#${childArray[4].id}`).append(`<p class="card-text">Temp: ${weather.daily[5].temp.day}</p>`);
    $(`#${childArray[4].id}`).append(`<p class="card-text">Wind: ${weather.daily[5].wind_speed}</p>`);
    $(`#${childArray[4].id}`).append(`<p class="card-text">Humidity: ${weather.daily[5].humidity}</p>`);
        
    updateHistory(city);

}

const updateHistory = (citySearched) => {
    
    if (JSON.parse(localStorage.getItem("searchHistory"))) {
        searchHistory = JSON.parse(localStorage.getItem("searchHistory")); 
    }
    
    // Add city searched to a library
    if (JSON.parse(localStorage.getItem("searchHistory")) == null) {

        searchHistory.push(citySearched);
        
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        // Render cities to page and add event listener to them
        $("#cities-wrapper").empty();
        searchHistory.forEach(city => {
            let button = $(`<button id="${city}">`);
            $("#cities-wrapper").append(button);
            $(`#${city}`).addClass("col citySearch bg-info bg-gradient text-center rounded text-light mb-2");
            $(`#${city}`).text(city);
            $(`#${city}`).on('click', function() {
                $("#citysearch").val(`${city}`);
                queryWeather(city)
            });
        })

    } else if (!JSON.parse(localStorage.getItem("searchHistory")).includes(citySearched)) {
        
        searchHistory.push(citySearched);
        
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        // Render cities to page and add event listener to them
        $("#cities-wrapper").empty();
        searchHistory.forEach(city => {
            let button = $(`<button id="${city}">`);
            $("#cities-wrapper").append(button);
            $(`#${city}`).addClass("col citySearch bg-info bg-gradient text-center rounded text-light mb-2");
            $(`#${city}`).text(city);
            $(`#${city}`).on('click', function() {
                $("#citysearch").val(`${city}`);
                queryWeather(city)
            });
        })
    }
}

const convertUnix = (unix) => {
    let unixDate = unix;
    let date = new Date(unixDate * 1000);
    let day =  `${date.getDate()}`;
    let month = `${date.getMonth()+1}`;
    let year = date.getFullYear();
    let format = `${day}/${month}/${year}`;
    return format;
}

// Event Listeners
$("#citysearch_submit").on('click', sanitiseEntry);
$("#clearHistory").on('click', function() {
    $("#cities-wrapper").empty();
    searchHistory = [];
    localStorage.clear()
})