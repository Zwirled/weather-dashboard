const searchBtn = $('#search-button');
const apiKey = 'de512be1dfc45ff6a68ed04d434e8f93';

searchBtn.on('click', function (event) {
    // Prevent the form refreshing on submit
    event.preventDefault();

    // Get the user-inputted value
    let city = $('#search-input').val().trim();
    // Query URL + City + API
    let geoQueryURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;

    $.ajax({
        url: geoQueryURL,
        method: 'GET'
    }).then(function (response) {

        // Get the latitude as a variable to 2 decimal places
        let latitude = response[0].lat.toFixed(2);
        // Get the longitude as a variable to 2 decimal places
        let longitude = response[0].lon.toFixed(2);
        // Query URL + Lat + Long + API Key
        let weatherQueryURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&units=metric&appid=' + apiKey;

        $.ajax({
            url: weatherQueryURL,
            method: 'GET'
        }).then(function (response) {

            let location = $('<button>').text(response.city.name);
            $('#history').prepend(location);
            getTemperatures(response);
            localStorage.setItem('location', location.text());

            location.on('click', function () {
                getTemperatures(response);
            });

        })
    })
});

$(document).ready(function () {

    // Get the location from local storage if it exists
    let location = localStorage.getItem('location');

    // If local storage item exists...
    if (location) {
        // add the saved location to the button
        let savedLocation = $('<button>').text(location);
        // prepend the saved location to the div
        $('#history').prepend(savedLocation);

        // when saved location is clicked...
        savedLocation.on('click', function () {

            // get the location
            let city = location;
            // add the city + API to the query url
            let geoQueryURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;

            $.ajax({
                url: geoQueryURL,
                method: 'GET'
            }).then(function (response) {

                // Get the latitude as a variable to 2 decimal places
                let latitude = response[0].lat.toFixed(2);
                // Get the longitude as a variable to 2 decimal places
                let longitude = response[0].lon.toFixed(2);
                // Query URL + Lat + Long + API Key
                let weatherQueryURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&units=metric&appid=' + apiKey;

                $.ajax({
                    url: weatherQueryURL,
                    method: 'GET'
                }).then(function (response) {
                    getTemperatures(response);
                });
            });
        });
    }
});

// Function to get all the temperatures for a location
function getTemperatures(response) {
    // Get the city name
    $('#today').empty();
    $('#forecast').empty();
    let name = $('<h2>').text(response.city.name);
    // Get the temp
    let temp = $('<p>').text('Temperature: ' + response.list[0].main.temp.toFixed(2) + '°C');
    // Get the wind speed
    let wind = $('<p>').text('Wind: ' + (response.list[0].wind.speed * 2.237).toFixed(2) + 'mph');
    // Get the humidity
    let humidity = $('<p>').text('Humidity: ' + response.list[0].main.humidity + '%');
    $('#today').append(name, temp, wind, humidity);

    for (let i = 1; i < 6; i++) {
        let column = $('<div>').attr('class', 'col');
        let name = $('<h2>').text(response.city.name);
        // Get the temp
        let temp = $('<p>').text('Temperature: ' + response.list[i].main.temp.toFixed(2) + '°C');
        // Get the wind speed
        let wind = $('<p>').text('Wind: ' + (response.list[i].wind.speed * 2.237).toFixed(2) + 'mph');
        // Get the humidity
        let humidity = $('<p>').text('Humidity: ' + response.list[i].main.humidity + '%');
        $('#forecast').append(column);
        $(column).append(name, temp, wind, humidity);
    }
}