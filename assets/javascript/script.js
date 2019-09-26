$(document).ready(function () {

    $("#submitWeather").on("click", function (event) {
      event.preventDefault();
      
  
      var city = $("#city").val().trim();
  
      if (city != '') {
        $("#error").html("");
  
        $.ajax({
  
          url: 'http://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=imperial" +
            "&APPID=b9c4e2e03106a1fd6d052f7ae1365efb",
          type: "GET",
          datatype: "jsonp",
          success: function (data) {
            var widget = show(data);
            console.log(data);
  
            $("#show").html(widget);
            $("#city").val("");
          }
        })
  
      } else {
       
     
      $("#error").html("Text field cannot be empty");
      }
    });
  });
  
  function show(data) {
    return "<h3><strong>Location</strong>: " + data.name + ", " + data.sys.country + "</h3>" +
      "<h3><strong>Current Temp</strong>: " + Math.round(data.main.temp) + '℉' + "</h3>" +
      "<h3><strong>Humidity</strong>: " + data.main.humidity + '%' + "</h3>" +
      "<h3><strong>Description</strong>: " + data.weather[0].description + "</h3>";
  }