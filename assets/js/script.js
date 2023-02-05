const searchBtn = $('#search-button');
const apiKey = 'de512be1dfc45ff6a68ed04d434e8f93';

let locations = [];

searchBtn.on('click', function (event) {
    // Prevent the form refreshing on submit
    event.preventDefault();

    // Get the user-inputted value
    let city = $('#search-input').val().trim();
    $('#search-input').val('');

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

            let location = response.city.name;
            let locations = localStorage.getItem('locations');

            if (locations) {
                locations = JSON.parse(locations);
                locations.push(location);
            } else {
                locations = [location];
            }

            localStorage.setItem('locations', JSON.stringify(locations));
            let locationBtn = $('<button>').text(location);
            $('#history').prepend(locationBtn);
            getTemperatures(response);

            locationBtn.on('click', function () {
                getTemperatures(response);
            });

        });
    });
});

$(document).ready(function () {
    let locations = localStorage.getItem('locations');
    if (locations) {
        locations = JSON.parse(locations);
        locations.forEach(function (location) {
            let locationBtn = $('<button>').text(location);
            $('#history').prepend(locationBtn);

            locationBtn.on('click', function () {
                // Query URL + City + API
                let geoQueryURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + location + '&limit=1&appid=' + apiKey;

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
        });
    }
});

// Function to get all the temperatures for a location
function getTemperatures(response) {
    // Get the city name
    $('#today').empty();
    $('#forecast').empty();

    // Get the city name
    let name = $('<h2>').text(response.city.name);
    // Get the date
    let date = $('<p>').text(moment(response.list[0].dt_txt).format('DD/MM/YYYY'));
    // Get the weather icon
    let icon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/' + response.list[0].weather[0].icon + '.png');
    // Get the temp
    let temp = $('<p>').text('Temperature: ' + response.list[0].main.temp.toFixed(2) + '°C');
    // Get the wind speed
    let wind = $('<p>').text('Wind: ' + (response.list[0].wind.speed * 2.237).toFixed(2) + 'mph');
    // Get the humidity
    let humidity = $('<p>').text('Humidity: ' + response.list[0].main.humidity + '%');
    $('#today').append(name, date, icon, temp, wind, humidity);

    let previousDate = "";
    let firstIteration = true;
    for (let i = 0; i < response.list.length; i++) {
        let currentDate = moment(response.list[i].dt_txt).format('DD/MM/YYYY');
        if (currentDate !== previousDate) {
            if (firstIteration === false) {
                let column = $('<div>').attr('class', 'col');
                // Get the date
                let date = $('<p>').text(currentDate);
                // Get the weather icon
                let icon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/' + response.list[i].weather[0].icon + '.png');
                // Get the temp
                let temp = $('<p>').text('Temperature: ' + response.list[i].main.temp.toFixed(2) + '°C');
                // Get the humidity
                let humidity = $('<p>').text('Humidity: ' + response.list[i].main.humidity + '%');
                $('#forecast').append(column);
                $(column).append(date, icon, temp, humidity);
            }
            previousDate = currentDate;
            firstIteration = false;
        }
    }
}