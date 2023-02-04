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
        console.log(response);
    })

});