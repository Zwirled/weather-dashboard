# Weather Dashboard

Create a weather dashboard for people going travelling - allow the user to input a location to see the weather data for current day + 5 additional days. The locations inputted should save to local storage so the user can quickly retrieve weather updates.

## 1
- Apply for API key.
- Link Geocoding API ( Allows user to input location, not longitude/latitude )
- Add a variable to the search button (#search-button), and add an event listener to it.
- add event.preventDefault() as the button is part of a form.
- Extract value that user enters in search ( val().trim() )
- Add the value entered to the query URL ( api URL - http://api.openweathermap.org/geo/1.0/direct?q={city-name},{state-code},{country-code}&limit={limit}&appid={API-key} )
- Run the AJAX method for the geocoding API...

- ...then()...

## 2
- Link 5 Day weather forecast Ajax ( Make sure the longitude/latitude from above user inputted location is received ).
- Output the name of the city as a button ( left hand column ) and save in local storage.
- Output the city name, current date, current temp, wind and and humidity.
- Output the next 5 days... date, temp, wind and humidity.