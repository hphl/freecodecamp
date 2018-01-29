$( document ).ready(function() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getWeather);
  } else {
      console.log("Something went wrong.") ;
  }
  $('.weather-measure').click(function(){
    if($(this).text() === "C"){
      $(this).text("F");
      $(".weather-value").text($(this).attr('data-fahrenheit'));
    }else{
      $(this).text("C");
      $(".weather-value").text($(this).attr('data-celsius'));
    }
  });
});

function getWeather(position){
  $.ajax({
     url: 'https://fcc-weather-api.glitch.me/api/current?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude,
     method: "GET",
     data: {
        format: 'json'
     },
     dataType: 'json',
     error: function(xhr, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
     },
     success: function(data, textStatus, request) {
        //console.log(data);
        showWeather(data);
     }
  });
}

function showWeather(data) {
  //console.log(data);
  // Here you get the data to modify as you please
  var weather_location = data.name + ',' + data.sys.country,
      celsius_value = data.main.temp,
      fahrenheit_value = Math.round((parseInt(celsius_value) * 1.8) + 32),
      weather_icon = data.weather[0].icon;
      //
      $('#weather-box .weather-location').text(weather_location);
      $('.weather-measure').attr('data-fahrenheit',fahrenheit_value);
      $('.weather-measure').attr('data-celsius',celsius_value);
      $('#weather-box .weather-value').text(celsius_value);
      $('#weather-box .weather-icon').attr("src", weather_icon);
}
