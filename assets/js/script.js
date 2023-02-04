const searchBtn = $('#search-button');
const apiKey = 'de512be1dfc45ff6a68ed04d434e8f93';

searchBtn.on('click', function (event) {
    // Prevent the form refreshing on submit
    event.preventDefault();

    // Get the user-inputted value
    let city = $('#search-input').val().trim();
    // Query URL + City + API
    let geoQueryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;

    $.ajax({
        url: geoQueryURL,
        method: "GET"
    }).then(function (response) {

        // Get the latitude as a variable to 2 decimal places
        let latitude = response[0].lat.toFixed(2);
        // Get the longitude as a variable to 2 decimal places
        let longitude = response[0].lon.toFixed(2);
        // Query URL + Lat + Long + API Key
        let weatherQueryURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=metric&appid=" + apiKey;

        console.log(weatherQueryURL);

        $.ajax({
            url: weatherQueryURL,
            method: "GET"
        }).then(function (response) {

            let name = $('<h2>').text(response.city.name);
            $('#today').append(name);
            let temp = $('<p>').text("Temperature: " + response.list[0].main.temp + "°C");
            $('#today').append(temp);
            let wind = $('<p>').text("Wind: " + response.list[0].wind.speed + "KPH");
            $('#today').append(wind);
            let humidity = $('<p>').text("Humidity: " + response.list[0].main.humidity + "%");
            $('#today').append(humidity);

        })
    })


});