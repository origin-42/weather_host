let apiKey = 'd3ddf23d533942a91d17b7f565e673f9';
let city = 'Western Australia';
let queryURLWeather = `http://api.openweathermap.org/data/2.5/weather`;
let queryURLForcast = `http://api.openweathermap.org/data/2.5/forecast`;

// Update city and call query with fetch
fetch(`${queryURLForcast}?q=${city}&appid=${apiKey}`)
.then(function (response) {

    console.log(response)
    return response.json();
})
.then(function (data) {
    console.log(data);
})

fetch(`${queryURLWeather}?q=${city}&appid=${apiKey}`)
.then(function (response) {

    console.log(response)
    return response.json();
})
.then(function (data) {
    console.log(data);
})