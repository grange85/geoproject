var version = "v0.3";	
var map; 				// the Google maps object
var gMarker;				// marker showing current location
var objSound = [];		// array to hold HTML5 sound objects
var objLocation = [];	// array to hold Google Maps LatLng objects of targets
var distance = [];		// array to hold distance between current location and target
var objCircle = [];		// array to hold Google Maps Circle objects of target locations
console.log("version "+ version);

var urlParams = new URLSearchParams(window.location.search);	// get the query string from the URL
var debug = urlParams.has("debug"); 							// boolean for debugging


/* set up the sound and positions
	locationFile	= the location of the audio file
	locationName	= the name of the location
	locationLat 	= the latitude of the location
	locationLon		= the longitude of the location
	distance 		= the radius of the area to monitor
	volume 			= the initial volume
	flag 			= the initial state of the flag
	colour 			= the colour of the area on the map
*/
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



// This is the callback function that runs the app - it's called in the Google Maps call in index.html
function initMap() {
  // initialise the Google Map
  map = new google.maps.Map(document.getElementById('map'), {
	center: {
	  lat: 51.5035218,
	  lng: -0.3415596
	},
	zoom: 14
  });


// This loops through the array of sounds and loads the sound, location and Circle objects into arrays
  for (i = 0; i < arrSounds.length; i++) {
	objSound[i] = new Audio(arrSounds[i].locationFile);		// Initialise Audio player object with the sound
	objSound[i].pause();									// Pause the player
	objSound[i].loop = true;								// Set the audio to loop
	objSound[i].volume = arrSounds[i].volume;				// Set the initial volumne
	objLocation[i] = new google.maps.LatLng(arrSounds[i].locationLat, arrSounds[i].locationLon);	// Initialise Google Maps LatLng object with target location
	objCircle[i] = new google.maps.Circle({					// Draw a circle on the map around the target location
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

  gMarker = new google.maps.Marker; 	// Initialise a marker 


// This is the main 
  if (navigator.geolocation) {
  	// initialise a Geolocation object and watch the current position
	id = navigator.geolocation.watchPosition(function(position) {

	  // Load current position into an object		
	  var pos = {
		lat: position.coords.latitude,
		lng: position.coords.longitude
	  };

	  var current = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); // Initialise Google Maps LatLng object with current position

	  // Loop through the sounds
	  for (i = 0; i < arrSounds.length; i++) {
		distance[i] = google.maps.geometry.spherical.computeDistanceBetween(objLocation[i], current); // store distance between current and target

		// if you car closer than the desired distance
		if (distance[i] < arrSounds[i].distance) {
			// if the sound is paused 
			if (objSound[i].paused) {
				objSound[i].play();		// start playing the sound
		  	}
			objSound[i].volume = (1 - distance[i] / arrSounds[i].distance);	// set the volume based on the distance to the target
		} else {
			// if we're not close enough to the object
			objSound[i].pause();		// pause the sound
		}
	}

	  // JQuery selector and load up some info
	  $("#pos").html("");
	  for (i = 0; i < arrSounds.length; i++) {
		$("#pos").append("<h4>Target :" + arrSounds[i].locationName + "</h4><ul><li>Distance = " + distance[i] + "</li><li>Volume = " + objSound[i].volume + "</li><li>Playing = " + !objSound[i].paused + "</li></ul>");
	  }

	  gMarker.setPosition(pos);			// locate the marker in current position
	  gMarker.setTitle('You are here');	// give marker a title
	  gMarker.setMap(map);				// place marker on the map

	  map.setCenter(pos);				// centre the map on the currentposition
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
