const searchBtn = $('#search-button');
const apiKey = 'de512be1dfc45ff6a68ed04d434e8f93';

// Create empty array to store locations
let locations = [];

// When the search button is clicked...
searchBtn.on('click', function (event) {
    // Prevent the form refreshing on submit
    event.preventDefault();

    // Get the user-inputted value
    let city = $('#search-input').val().trim();
    // Empty the input field
    $('#search-input').val('');

    // Check if the location has already been searched
    if (locations.includes(city)) {
        // If the location has already been searched, return
        return;
    }
    // Add the city to the list of locations
    locations.push(city);

    // Create the query URL + City + API
    let geoQueryURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;

    $.ajax({
        url: geoQueryURL,
        method: 'GET'
    }).then(function (response) {

        // Get the latitude as a variable to 2 decimal places
        let latitude = response[0].lat.toFixed(2);
        // Get the longitude as a variable to 2 decimal places
        let longitude = response[0].lon.toFixed(2);
        // Create the query URL + Lat + Long + API Key
        let weatherQueryURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&units=metric&appid=' + apiKey;

        $.ajax({
            url: weatherQueryURL,
            method: 'GET'
        }).then(function (response) {

            // Add class 'active' to wrap div
            $('.wrap').addClass('active');

            // Get the location name
            let location = response.city.name;
            // Get the locations from local storage
            let locations = localStorage.getItem('locations');

            // If locations exist...
            if (locations) {
                // Add another location to locations array
                locations = JSON.parse(locations);
                locations.push(location);
            } else {
                // Else, add first location to the locations array
                locations = [location];
            }

            // Set the locations into local storage
            localStorage.setItem('locations', JSON.stringify(locations));

            // Create a button to store location name
            let locationBtn = $('<button>').text(location);
            // Prepend the button to the history div
            $('#history').prepend(locationBtn);
            // Call the getTemperatures function
            getTemperatures(response);

            // If location button is clicked...
            locationBtn.on('click', function () {
                // Call the getTemperatures function
                getTemperatures(response);
            });

        });
    });
});

// On page load...
$(document).ready(function () {
    // Get saved locations from local storage
    let locations = localStorage.getItem('locations');
    // If locations exist...
    if (locations) {

        // Add class 'active' to wrap div
        $('.wrap').addClass('active');

        // Convert string to object
        locations = JSON.parse(locations);

        // for each location...
        locations.forEach(function (location) {
            // Create a button to store location name
            let locationBtn = $('<button>').text(location);
            // Prepend the button to the history div
            $('#history').prepend(locationBtn);

            // If location button is clicked...
            locationBtn.on('click', function () {

                // Create the query URL + City + API
                let geoQueryURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + location + '&limit=1&appid=' + apiKey;

                $.ajax({
                    url: geoQueryURL,
                    method: 'GET'
                }).then(function (response) {

                    // Get the latitude as a variable to 2 decimal places
                    let latitude = response[0].lat.toFixed(2);
                    // Get the longitude as a variable to 2 decimal places
                    let longitude = response[0].lon.toFixed(2);
                    // Create the query URL + Lat + Long + API Key
                    let weatherQueryURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&units=metric&appid=' + apiKey;

                    $.ajax({
                        url: weatherQueryURL,
                        method: 'GET'
                    }).then(function (response) {
                        // Call the getTemperatures function
                        getTemperatures(response);
                    });
                });
            });
        });
    }

    // Make the most recent location button be clicked on page load
    $("#history button").first().click();
});

// Create a clear button
let clearBtn = $('<button>').text('Clear history');
// Append the clear button to the history div
$('#clear').append(clearBtn);

// When the clear button is clicked...
clearBtn.on('click', function () {
    // Remove the locations from local storage
    localStorage.removeItem('locations');
    // Empty the history div
    $('#history').empty();
});

// Function to get all the temperatures for a location
function getTemperatures(response) {
    // Empty the today div
    $('#today').empty();
    // Empty the forecast div
    $('#forecast').empty();

    // Get the city name
    let name = $('<h2>').text(response.city.name);
    // Get the date
    let date = $('<p>').text(moment(response.list[0].dt_txt).format('DD/MM/YYYY'));
    // Get the weather icon
    let icon = $('<img>').attr('src', 'https://openweathermap.org/img/wn/' + response.list[0].weather[0].icon + '.png');
    // Get the temp
    let temp = $('<p>').text('Temperature: ' + response.list[0].main.temp.toFixed(2) + '°C');
    // Get the wind speed
    let wind = $('<p>').text('Wind: ' + (response.list[0].wind.speed * 2.237).toFixed(2) + 'mph');
    // Get the humidity
    let humidity = $('<p>').text('Humidity: ' + response.list[0].main.humidity + '%');
    // Append the name, date, icon, temp, wind and humidity to the today div
    $('#today').append(name, date, icon, temp, wind, humidity);

    for (let i = 0; i < response.list.length; i++) {

        // Get the time of the current iteration...
        let time = moment(response.list[i].dt_txt).format('HH:mm:ss');

        // If it is midday, run the iteration
        if (time === '12:00:00') {
            let column = $('<div>').attr('class', 'col');
            // Get the date
            let date = $('<p>').text(moment(response.list[i].dt_txt).format('DD/MM/YYYY'));
            // Get the weather icon
            let icon = $('<img>').attr('src', 'https://openweathermap.org/img/wn/' + response.list[i].weather[0].icon + '.png');
            // Get the temp
            let temp = $('<p>').text('Temperature: ' + response.list[i].main.temp.toFixed(2) + '°C');
            // Get the humidity
            let humidity = $('<p>').text('Humidity: ' + response.list[i].main.humidity + '%');
            // Append the column to the forecast div
            $('#forecast').append(column);
            // Append the date, icon, temp and humidity to the column
            $(column).append(date, icon, temp, humidity);
        }
    }
}
