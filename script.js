var map = L.map('mapid').fitWorld();

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWdlbnRoZXNoIiwiYSI6ImNrZ3NjcXA4YTEzd3Qyemw4d3g4Nnlqd2QifQ.hyVUtRepmy9kxZ7oDQ02aw'
}).addTo(map);

map.locate({setView: true, maxZoom: 15, enableHighAccuracy: true, watch: true});

var routingControl = L.Routing.control({
  waypoints: [],
  router: L.Routing.mapbox('pk.eyJ1IjoiYWdlbnRoZXNoIiwiYSI6ImNrZ3NjcXA4YTEzd3Qyemw4d3g4Nnlqd2QifQ.hyVUtRepmy9kxZ7oDQ02aw')
}).addTo(map);

var current_position, current_accuracy, currentlatlng, destinationlatlng;

    function onLocationFound(e) {
      // if position defined, then remove the existing position marker and accuracy circle from the map
      if (current_position) {
          map.removeLayer(current_position);
          map.removeLayer(current_accuracy);

          currentlatlng = e.latlng;

          var oldWayPoints = routingControl.getWaypoints();

          oldWayPoints.splice(0,1,L.latLng(e.latlng));

          routingControl.setWaypoints(oldWayPoints);

          dataToPost(currentlatlng,destinationlatlng);


      }

      var radius = e.accuracy / 2;

      currentlatlng = e.latlng;

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

      destinationlatlng = e.latlng
      routingControl.setWaypoints([L.latLng(currentlatlng),L.latLng(e.latlng)]);
      dataToPost(currentlatlng,destinationlatlng);
    }

    map.on('click', onMapClick);



    // // wrap map.locate in a function    
    // function locate() {
    //   map.locate({setView: true, maxZoom: 15});
    // }

    // // call locate every 3 seconds... forever
    // setInterval(locate, 3000);

    // L.Routing.control({
    //   waypoints: [
    //     L.latLng(currentLatLng),
    //     L.latLng(e.latlng)
    //   ],
    //   router: L.Routing.mapbox('pk.eyJ1IjoiYWdlbnRoZXNoIiwiYSI6ImNrZ3NjcXA4YTEzd3Qyemw4d3g4Nnlqd2QifQ.hyVUtRepmy9kxZ7oDQ02aw')
    // }).addTo(map);

    function dataToPost(currentLatLng,destinationLatLng){

      var newData = {
        currentPos:{
          lat: currentLatLng.lat,
          lng: currentLatLng.lng
        },
        destinationPos:{
          lat: destinationLatLng.lat,
          lng: destinationLatLng.lng
        }
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