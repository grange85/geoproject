console.log("version 0.2");
var map, 
  gMarker, 
  objSound = [],
  objLocation = [],
  distance = [],
  objCircle = [];

var urlParams = new URLSearchParams(window.location.search);
var debug = urlParams.has("debug");

var arrSounds = [{
    "locationFile": "audio/pier1.mp3",
    "locationName": "The Pier",
    "locationLat": 51.504011,
    "locationLon": -0.343702,
    "distance": 500,
    "volume": 0,
    "flag": 0,
    "colour": "#ff0000"
  },
  {
    "locationFile": "audio/waves1.mp3",
    "locationName": "The Beach",
    "locationLat": 51.5066869,
    "locationLon": -0.3375161,
    "distance": 500,
    "volume": 0,
    "flag": 0,
    "colour": "#00ff00"
  },
  {
    "locationFile": "audio/sound3.mp3",
    "locationName": "The Pier",
    "locationLat": 51.507011,
    "locationLon": -0.345702,
    "distance": 100,
    "volume": 0,
    "flag": 0,
    "colour": "#0000ff"
  },
  {
    "locationFile": "audio/sound4.mp3",
    "locationName": "The Pier",
    "locationLat": 51.509011,
    "locationLon": -0.348702,
    "distance": 100,
    "volume": 0,
    "flag": 0,
    "color": "#ffff00"
  },
  {
    "locationFile": "audio/sound5.mp3",
    "locationName": "The Pier",
    "locationLat": 51.501011,
    "locationLon": -0.341702,
    "distance": 100,
    "volume": 0,
    "flag": 0,
    "color": "#00ffff"
  }
];


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 51.5035218,
      lng: -0.3415596
    },
    zoom: 14
  });

  for (i = 0; i < arrSounds.length; i++) {
    objSound[i] = new Audio(arrSounds[i].locationFile);
    objSound[i].pause();
    objSound[i].loop = true;
    objSound[i].volume = arrSounds[i].volume;
    objLocation[i] = new google.maps.LatLng(arrSounds[i].locationLat, arrSounds[i].locationLon);
    objCircle[i] = new google.maps.Circle({
      strokeColor: arrSounds[i].colour,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: arrSounds[i].colour,
      fillOpacity: 0.35,
      map: map,
      center: objLocation[i],
      radius: arrSounds[i].distance
    });
  }

  gMarker = new google.maps.Marker;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    id = navigator.geolocation.watchPosition(function(position) {

      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      var current = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      for (i = 0; i < arrSounds.length; i++) {
        distance[i] = google.maps.geometry.spherical.computeDistanceBetween(objLocation[i], current);

        console.log(debug);
        if (arrSounds[i].flag == 0 && distance[i] < arrSounds[i].distance && !debug) {
          objSound[i].play();
          objSound[i].volume = (1 - distance[i] / arrSounds[i].distance);
          arrSounds[i].flag = 1;
          //                  console.log ((1 - distance[i]/arrSounds[i].distance));
        }
      }
      $("#pos").html("");
      for (i = 0; i < arrSounds.length; i++) {
        $("#pos").append("Distance = " + distance[i] + " | Volume = " + objSound[i].volume + " | flag = " + arrSounds[i].flag + "<br/>");
      }

      gMarker.setPosition(pos);
      gMarker.setTitle('You are here');
      gMarker.setMap(map);

      map.setCenter(pos);
    }, function() {
      handleLocationError(true, gMarker, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, gMarker, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, gMarker, pos) {
  gMarker.setPosition(pos);
  gMarker.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  gMarker.open(map);
}
