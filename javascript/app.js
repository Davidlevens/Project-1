// API MAP
var map;

function initMap() {
    var latlongitud = new google.maps.LatLng(25.6714, -100.309);
    map = new google.maps.Map(document.getElementById("map-display"), {
        center: latlongitud,
        zoom: 12
    });
}

$(document).ready(function () {

    var service
    var city;
    var geocoder;
    var typeOfInterest;
    var request;
    var latLong;
    var searchType;
    var radius;
    var marker;
    var infoWindow;
    var photos;
    var markers = [];

    function initialize() {
        geocoder = new google.maps.Geocoder();
        service = new google.maps.places.PlacesService(map);
        infoWindow = new google.maps.InfoWindow();
    }

    function geocodeAdress(geocoder, resultsMap) {
        var address = $("#inputCity").val();
        console.log(address);
        geocoder.geocode({ "address": address }, function (results, status) {
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                latLong = results[0].geometry.location;
                searchType = results[0].types[0];
                if (searchType == "country")
                    resultsMap.setZoom(6);
                else if (searchType == "administrative_area_level_1") {
                    resultsMap.setZoom(8);
                }
                else {
                    resultsMap.setZoom(13);
                }
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }


    function interestPoints(results, status) {

        console.log(status);
        if (status == google.maps.places.PlacesServiceStatus.OK) {

            for (var i = 0; i < results.length; i++) {
                setTimeout(createMarker, 200, results[i]);
            }
        }
    }

    function searchTypes() {

        if (searchType == 'country')
            radius = '50000';
        else if (searchType == 'administrative_area_level_1')
            radius = '25000';
        else
            radius = '5000';
    }

    function makeRequest() {
        request = {
            location: latLong,
            radius: radius,
            query: typeOfInterest
        }
    }
    function clearMarkers() {
        setMapOnAll(null);
        markers = [];
    }

    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    function createMarker(results) {

        console.log(results);

        console.log(photos);
        var content = '<div id = "titleMarker">' + '<h4>' + results.name + '</h4>' + '</div>' + '<div id = "informationMarker"><p>' + results.formatted_address + '</p></div>';
        var marker = new google.maps.Marker({
            position: results.geometry.location,
            map: map,
            animation: google.maps.Animation.DROP,
            title: 'Hello World!'
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function () {

            infoWindow.setContent(content);
            infoWindow.open(map, this);
        });
    }


//     // Code radio buttons
//    $(document.body).on("click", ".top-places", function () {
//        var place = $(this).attr("data-place");
//        console.log(place);
//        doSearch(place);
//        geocodeAdress(geocoder, map);
//    });
//    function doSearch(place) {
//        // 1. get map
//        // 2. get weather
//        // 3. get packing lisgt
//    }

//


    $("#searchCity").on("click", function () {
        city = $("#inputCity").val();
        geocodeAdress(geocoder, map);
    });

    $("#Restaurant").on("click", function () {
        clearMarkers();
        typeOfInterest = $("#Restaurant").text();
        console.log(typeOfInterest);
        searchTypes();
        makeRequest();
        console.log(request);
        service.textSearch(request, interestPoints);
    });

    $("#Store").on("click", function () {
        clearMarkers();
        typeOfInterest = $("#Store").text();
        console.log(typeOfInterest);
        searchTypes();
        makeRequest();
        console.log(request);
        service.textSearch(request, interestPoints);
    });

    $("#Bar").on("click", function () {
        clearMarkers();
        typeOfInterest = $("#Bar").text();
        console.log(typeOfInterest);
        searchTypes();
        makeRequest();
        console.log(request);
        service.textSearch(request, interestPoints);
    });
    $("#Museum").on("click", function () {
        clearMarkers();
        typeOfInterest = $("#Museum").text();
        console.log(typeOfInterest);
        searchTypes();
        makeRequest();
        console.log(request);
        service.textSearch(request, interestPoints);
    });

    initialize();



    // FIREBASE

    var firebaseConfig = {
        apiKey: "AIzaSyAkBpVFYyWDdcG2PbcsJXVA0mGC1qn2KYo",
        authDomain: "booming-monitor-252720.firebaseapp.com",
        databaseURL: "https://booming-monitor-252720.firebaseio.com",
        projectId: "booming-monitor-252720",
        storageBucket: "",
        messagingSenderId: "718629106456",
        appId: "1:718629106456:web:9e5f5631f940c3e86ca46d"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
    
      // Get a reference to the database service
      var database = firebase.database();

      var path = "project-1";


    $("#searchCity").click(function (e) {

        e.preventDefault();

        var citysearched = $("#inputCity").val().trim();

        database.ref().push({
            citysearched: citysearched
        })

    });

    database.ref().on("child_added", function (snapshot) {
         
        
        var btndump = $(".modal-body");
        var city = snapshot.val().citysearched;
        var cityBtn = $("<button>");
        cityBtn.addClass("btn-primary", "searchbtn");
        cityBtn.attr("btn-primary");
        cityBtn.text(city);
        btndump.append(cityBtn);

        // $(cityBtn).on("click", function () {



    });




    // SHOW MODAL

    $("#myModal").on('shown.bs.modal', function () {
        $("#myModal").trigger('focus');
    });


    // AUTOCOMPLETE LOCATION
    // $("input").geocomplete();

    // Trigger geocoding request.
    $("#searchCity").click(function () {
        $("#inputCity").trigger("geocode");
    });

    // SEARCH RESULTS ANIMATION
    $("#searchCity").on("click", function () {
        $('#paperPlane').fadeOut('slow', function () {
            $('.search-results').fadeIn("slow");
        });
    });


    // API CITY COVER IMAGE

    $('#searchCity').on('click', function (e) {
        e.preventDefault();

        var api = "https://api.unsplash.com/search/photos?per_page=1&query=";
        var searchInput = $("#inputCity").val();
        var appID = "a2cd819eb892c58dd92b472a39c35f0a71def1567b12b60b1de8e635ad7cce27";
        var queryURL = api + searchInput + "&client_id=" + appID;


        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            console.log(response);
            var photoImage = $("<img class='card-img'>");
            photoImage.attr("src", response.results[0].urls.regular);

            $("#cover").append(photoImage);

        });

        var citytName = $("<h1 class='card-title'>").text(searchInput);
        $("#cover").empty();

        $("#cityNameDisplay").empty();

        $("#cityNameDisplay").append(citytName);
        // $("#cityNameDisplay").append(name + ", " + country);

    });

    // NEWS SECTION

    $("#myModal").on('shown.bs.modal', function () {
        $("#myModal").trigger('focus');
    });



    $("#searchCity").on("click", function () {
        var city = $("#inputCity").val();
        city = city.split(",")[0];
        console.log(city);

        // 'q=' + country +
        var queryURL = 'https://newsapi.org/v2/top-headlines?' +
            'q=' + city +
            '&from=2019-09-27&' +
            'sortBy=popularity&' +
            'language=en&' +
            'apiKey=2e54b9d0bb014c33b792823cbd90ea19';
        $.ajax({
            url: queryURL,
            method: "GET"
        })

            .then(function (response) {
                console.log(queryURL);
                console.log(response);
                var slides = response.articles.map((article) => {
                    var slide = $("<li class='slide'>");
                    var newsTitle = $("<p class='newsTitle'>");
                    newsTitle.text(article.title);

                    var newsDescription = $("<p class='newsDes'>");
                    newsDescription.text(article.description);

                    var newsImage = $("<img class='imgNews'>");
                    newsImage.attr("src", article.urlToImage);

                    slide.append(newsTitle, newsDescription, newsImage);
                    return slide;
                });

                $("#slider").append(slides);
                setTimeout(initializeSlider, 1000);
            });

        $('#paperPlane').fadeOut('slow', function () {
            $('.search-results').fadeIn("slow");
        });
    });

    //a timer will call this function, and the rotation will begin
    function rotate() {
        $('#next').click();
    }


    function initializeSlider() {
        $("#slider").lightSlider({
            adaptiveHeight: true,
            item: 1,
            slideMargin: 0,
            loop: true
        });
    }
    // API WEATHER

    $("#searchCity").on("click", function (event) {

        event.preventDefault();

        var city = $("#inputCity").val().trim();
        

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=b9c4e2e03106a1fd6d052f7ae1365efb";

        $.ajax({
            url: queryURL,
            method: "GET"

        }).then(function (response) {
            console.log("line369" + response);
            console.log(queryURL);

            var temp = response.main.temp;
            var name = response.name;
            var country = response.sys.country;
            var iconW = response.weather.icon;
            var iconurl = "http://openweathermap.org/img/w/" + iconW + ".png";


            $("#temperature").text("Temperature:  " + Math.round(temp)  + " °F");
            $("#max-min-temp").text("Max/Min Temp:  " + Math.round(response.main.temp_max) + " °F / " + Math.round(response.main.temp_min) + " °F");
            // $("#condition").attr("src", iconurl);
            // $("#wcondition").text("Condition: " + response.weather.id);
            $("#wind").text("Wind Speed: " + Math.round(response.wind.speed)  +  " mph");
            $("#humidity").text("Humidity: " + response.main.humidity  + " %");

            console.log(temp);
            console.log(name + ", " + country);


        });
    });
});




// //Open Weather Map API Documentation
// //Current Weather Data
// var unirest = require("unirest");

// var req = unirest("GET", "https://community-open-weather-map.p.rapidapi.com/weather");

// req.query({
//     "callback": "test",
//     "id": "2172797",
//     "units": "\"metric\" or \"imperial\"",
//     "mode": "xml, html",
//     "q": "London,uk"
// });

// req.headers({
//     "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
//     "x-rapidapi-key": "608dc029b2msh7a774b700e1f7cep12fad0jsn787567011130"
// });


// req.end(function (res) {
//     if (res.error) throw new Error(res.error);

//     console.log(res.body);
// });

// //Forcast Weather Data
// var unirest = require("unirest");

// var req = unirest("GET", "https://community-open-weather-map.p.rapidapi.com/forecast");

// req.query({
//     "q": "london,uk"
// });

// req.headers({
//     "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
//     "x-rapidapi-key": "608dc029b2msh7a774b700e1f7cep12fad0jsn787567011130"
// });


// req.end(function (res) {
//     if (res.error) throw new Error(res.error);

//     console.log(res.body);
// });

// $(document).ready(function () {
//     var appID = "PUT YOUR API KEY HERE";

//     $(".query_btn").click(function () {
//         var query_param = $(this).prev().val();
//     })
// });

// $(document).ready(function () {
//     var appID = "PUT YOUR API KEY HERE";

//     $(".query_btn").click(function () {

//         var query_param = $(this).prev().val();

//         if ($(this).prev().attr("placeholder") == "City") {
//             var weather = "http://api.openweathermap.org/data/2.5/weather?q=" + query_param + "&APPID=" + appID;
//         } else if ($(this).prev().attr("placeholder") == "Zip Code") {
//             var weather = "http://api.openweathermap.org/data/2.5/weather?zip=" + query_param + "&APPID=" + appID;
//         }
//     })
// });


// $(document).ready(function () {
//     var appID = "PUT YOUR API KEY HERE";

//     $(".query_btn").click(function () {

//         var query_param = $(this).prev().val();

//         if ($(this).prev().attr("placeholder") == "City") {
//             var weather = "http://api.openweathermap.org/data/2.5/weather?q=" + query_param + "&APPID=" + appID;
//         } else if ($(this).prev().attr("placeholder") == "Zip Code") {
//             var weather = "http://api.openweathermap.org/data/2.5/weather?zip=" + query_param + "&APPID=" + appID;
//         }

//         $.getJSON(weather, function (json) {
//             $("#city").html(json.name);
//             $("#main_weather").html(json.weather[0].main);
//             $("#description_weather").html(json.weather[0].description);
//             $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
//             $("#temperature").html(json.main.temp);
//             $("#pressure").html(json.main.pressure);
//             $("#humidity").html(json.main.humidity);
//         });
//     })

//     // Optional Code for temperature conversion
//     var fahrenheit = true;

//     $("#convertToCelsius").click(function () {
//         if (fahrenheit) {
//             $("#temperature").text(((($("#temperature").text() - 32) * 5) / 9));
//         }
//         fahrenheit = false;
//     });

//     $("#convertToFahrenheit").click(function () {
//         if (fahrenheit == false) {
//             $("#temperature").text((($("#temperature").text() * (9 / 5)) + 32));
//         }
//         fahrenheit = true;
//     });
// });

// <script async defer
//     src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCBNs5xGO2H4kcLTK3eoxf966QgDaqseK4&callback=initMap">
// </script>