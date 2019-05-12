\var version = "v0.3";	
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
	"locationFile": "audio/pier3.mp3",
	"locationName": "Palace Pier",
	"locationLat": 51.502465, 
	"locationLon": -0.338309,
	"distance": 200,
	"volume": 0,
	"flag": 0,
	"colour": "#ff0000"
  },
  {
	"locationFile": "audio/waves3.mp3",
	"locationName": "Beach",
	"locationLat": 51.504720, 
	"locationLon": -0.335074,
	"distance": 200,
	"volume": 0,
	"flag": 0,
	"colour": "#00ff00"
  },
  {
	"locationFile": "audio/park3.mp3",
	"locationName": "Old Steine",
	"locationLat": 51.505201, 
	"locationLon": -0.338840,
	"distance": 200,
	"volume": 0,
	"flag": 0,
	"colour": "#0000ff"
//   },
//   {
// //	"locationFile": "audio/.mp3",
// //	"locationName": "Mellotron",
// //	"locationLat": 51.503992, 
// //	"locationLon": -0.336920,
// //	"distance": 29,
// //	"volume": 1,
// //	"flag": 0,
// //	"color": "#ffff00"
//   },
//   {
// //	"locationFile": "audio/.mp3",
// //	"locationName": "Sussex Campus N01se",
// //	"locationLat": 50.866786, 
// //	"locationLon": -0.087511,
// //	"distance": 50,
// //	"volume": 0,
// //	"flag": 0,
// //		"color": "#00ffff"
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
	objSound[i] = new Audio(arrSounds[i].locationFile);	//audio player object
	objSound[i].pause();								// pauses					
	objSound[i].loop = true;							// set the audio to loop						
	objSound[i].volume = arrSounds[i].volume;			// set the starting volume 			
	objLocation[i] = new google.maps.LatLng(arrSounds[i].locationLat, arrSounds[i].locationLon);// start google maps LatLng objectwith the target location
	objCircle[i] = new google.maps.Circle({				// draw a circle around the trigger location		
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

  gMarker = new google.maps.Marker; 	// marker


//main loop
  if (navigator.geolocation) {

 //geolcation object and watchPosition
	id = navigator.geolocation.watchPosition(function(position) {


	$(function() {
		$("#stop").click( function() {
			for (i = 0; i < arrSounds.length; i++) {
				objSound[i].pause();
			}
			navigator.geolocation.clearWatch(id);
		})
	});




	 // load current position to object
	  var pos = {
		lat: position.coords.latitude,
		lng: position.coords.longitude
	  };

	  var current = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); //google maps LatLng object with current position

	
	  for (i = 0; i < arrSounds.length; i++) {
		distance[i] = google.maps.geometry.spherical.computeDistanceBetween(objLocation[i], current); // store distance between current and target

		// if you car closer than the desired distance
		if (distance[i] < arrSounds[i].distance) {
			// if the sound is paused 
			if (objSound[i].paused) {
				objSound[i].play();		// start playing sound
		  	}
		  	var difference = (1 - distance[i] / arrSounds[i].distance)

			objSound[i].volume = (difference);	// set the volume based on the distance to the trigger
	

		} else {
			// if not close enough to the object
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

