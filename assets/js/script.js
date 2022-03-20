let apiKey = 'd3ddf23d533942a91d17b7f565e673f9';
let queryURLOneCall = `https://api.openweathermap.org/data/2.5/onecall`;
let getCoords = `https://api.openweathermap.org/data/2.5/weather`;
let iconURL = `https://openweathermap.org/img/wn/`;
let googleFailedQuery = `https://maps.google.com/`;

const getTodaysDate = () => {
    let todaysDate = new Date();
    return todaysDate;
}

const renderCities = (history) => {
    $("#cities-wrapper").empty();
    history.forEach(city => {
        idify = city.replace(/\s/g, '');
        let button = $(`<button id="${idify}">`);
        $("#cities-wrapper").append(button);
        $(`#${idify}`).addClass("col citySearch bg-info bg-gradient text-center rounded text-light mb-2");
        $(`#${idify}`).text(city);
        $(`#${idify}`).on('click', function() {
            $("#citysearch").val(`${city}`);
            queryWeather(city)
        });
    })
}

const toolTip = (err, query) => {
    if (err === "Is this a city?") {
        $("#citysearch").after(`<p id="err" class="text-center bg-warning rounded text-light">${err}</p>`);
        $("#err").after(`<p id="${query}" class="text-center bg-warning rounded text-light"><u>Google it?</u></p>`);
        $(`#${query}`).on('click', function() {
            window.open(`${googleFailedQuery}?q=${query}`,'_blank');
        })
        setTimeout(function() {
            $("#err").remove();
            $(`#${query}`).remove();
        },5000);
    } else {
        $("#citysearch").after(`<p id="err" class="text-center bg-warning rounded text-light">${err}</p>`);
        setTimeout(function() {
            $("#err").remove();
        },2000);
    }
}

let searchHistory = [];
if (JSON.parse(localStorage.getItem("searchHistory"))) {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory")); 

    renderCities(searchHistory);
}


// Update city and call query with fetch
const queryWeather = (cityName) => {

    // Collect data
    let weatherData;

    fetch(`${getCoords}?q=${cityName}&appid=${apiKey}`)
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
            renderInfo(cityName, weatherData);
        })
        .catch((err) => {
            toolTip("Is this a city?", cityName);
        });
    })
    .catch((err) => {
        toolTip("Is this a city?", cityName);
    });
    
}


// Sanitise user entry
const sanitiseEntry = (event) => {
    event.preventDefault();
    
    let value = $("#citysearch").val();
    value = value.trim();
    let restrictions = /^[a-zA-Z\s]*$/;

    if (value.match(restrictions)) {

        let uppercaseWords = value.split(" ");
        let upperCased = [];
        uppercaseWords.forEach(value => {
            let upperCase = uppercaseWords[uppercaseWords.indexOf(value)][0].toUpperCase()
            value = value.substring(1);
            upperCased.push(`${upperCase}${value}`);
        })
        upperCased = upperCased.join(" ");

        // Gives sanitised value;
        queryWeather(upperCased);
    } else {

        toolTip("letters only");

        return
    }
} 

const renderInfo = (city, weather) => {
    // Add style to page
    if (weather && $("#searchContainer").attr('data-hide', 'hidden')) {
        $("#searchContainer").attr('data-hide', 'visible');
    }
    
    // <!-- Displayed information for weather -->
        // <!-- City name, date, and weather icon -->
        $("#cityName").text(`${city}, ${weather.timezone} `);
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
    let dailyWeather = weather.daily.slice(1, 6);

    for (let i = 0; i < childArray.length; i++) {
        $(`#${childArray[i].id}`).empty();
        $(`#${childArray[i].id}`).append(`<h5 class="card-title">${convertUnix(dailyWeather[0].dt)}</h5>`);
        $(`#${childArray[i].id}`).append(`<img src="${iconURL}${dailyWeather[0].weather[0].icon}@2x.png" class="card-text"></img>`);
        $(`#${childArray[i].id}`).append(`<p class="card-text">Temp: ${dailyWeather[0].temp.day}</p>`);
        $(`#${childArray[i].id}`).append(`<p class="card-text">Wind: ${dailyWeather[0].wind_speed}</p>`);
        $(`#${childArray[i].id}`).append(`<p class="card-text">Humidity: ${dailyWeather[0].humidity}</p>`);
        dailyWeather.shift();
    }
        
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
        renderCities(searchHistory);

    } else if (!JSON.parse(localStorage.getItem("searchHistory")).includes(citySearched)) {
        
        searchHistory.push(citySearched);
        
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        // Render cities to page and add event listener to them
        renderCities(searchHistory);
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