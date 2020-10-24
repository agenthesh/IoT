var map = L.map('mapid').fitWorld();

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWdlbnRoZXNoIiwiYSI6ImNrZ2w1czgzZzBxOWMydG5haXprZ3QxcTQifQ.V6YSkIJC02Zx-pbNnfwl6g'
}).addTo(map);

map.locate({setView: true, maxZoom: 15});

var current_position, current_accuracy, currentLatLng;

    function onLocationFound(e) {
      // if position defined, then remove the existing position marker and accuracy circle from the map
      if (current_position) {
          map.removeLayer(current_position);
          map.removeLayer(current_accuracy);
      }

      var radius = e.accuracy / 2;

      currentLatLng = e.latlng;

      current_position = L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

      current_accuracy = L.circle(e.latlng, radius).addTo(map); 
    }
    

    function onLocationError(e) {
      alert(e.message);
    }

    

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    //create an alert to ask user to set a destination
    setTimeout(function(){ alert("Your location has been found, please enter a destination by clicking on the map"); }, 1500);


    function onMapClick(e) {

        L.Routing.control({
            waypoints: [
              L.latLng(currentLatLng),
              L.latLng(e.latlng)
            ]
          }).addTo(map);

          var newData = {
            currentPos:{lat:currentLatLng.lat,lng:currentLatLng.lng},
            destinationPos:{lat:e.latlng.lat,lng:e.latlng.lng}
          }

          $.ajax({
            type: "POST",
            url: "http://localhost:3000",
            data: newData,
            success: function(){
                console.log("SENT SUCCESSFULLY");
            },
            dataType: "JSON"
          });
          
    }

    map.once('click', onMapClick);

    // // wrap map.locate in a function    
    // function locate() {
    //   map.locate({setView: true, maxZoom: 15});
    // }

    // // call locate every 3 seconds... forever
    // setInterval(locate, 3000);