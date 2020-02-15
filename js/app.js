// initialize map
var access_token = 'access_token=pk.eyJ1IjoiYW5kcm9pZHBpdGkiLCJhIjoiY2lvd3VwamhmMDA4MHZ0a2p0OGJnYnRhNSJ9.fITbznDvS6FhARaYxrW_Pw#10';
var map = L.map('map', {
    'center': [52.5200066, 13.404954],
    'zoom': 5,
    'timeDimension': true,
    'layers': [
        L.tileLayer('https://api.mapbox.com/styles/v1/androidpiti/ck2j9fns70ul51cpn8rqnmqb1/tiles/256/{z}/{x}/{y}?' + access_token, {
            'attribution': '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })
    ]
});

// start of TimeDimension manual instantiation
var timeDimension = new L.TimeDimension({
    period: "PT1M"
});
map.timeDimension = timeDimension; 

// player instance with TimeDimension and some options
var player = new L.TimeDimension.Player({
    transitionTime: 1000,
    loop: true,
    startOver: false
}, timeDimension);

// options player control
var timeDimensionControlOptions = {
    player: player,
    title: "Flight from Berlin to Zagreb",
    loopButton: true,
    speedSlider: false,
    timeDimension: timeDimension,
    position: 'topright',
    autoPlay: true,
    timeSliderDragUpdate: true,
    timeZones: ["Local"]
};

// add player control to map
var timeDimensionControl = new L.Control.TimeDimension(timeDimensionControlOptions);
map.addControl(timeDimensionControl);

// custom icon for flight  
var iconPlane = L.icon({
    iconUrl: 'icon/flight_white.png',
    iconAnchor: [12, 12],
    popupAnchor: [-3, -76],
    iconSize: [30, 30]
});

// creat customLayer for geoJSON
var customLayer = L.geoJson(null, {
    pointToLayer: function (feature, latLng) {
        if (feature.properties.hasOwnProperty('last')) {
            return new L.Marker(latLng, {
                icon: iconPlane
            });
        }
        return L.circleMarker(latLng);
    }
});

// load gpx-file with leaflet-omnivore and assign to customLayer 
var gpxLayer = omnivore.gpx('data/BER-ZAG_2019-NOV.gpx', null, customLayer).on('ready', function () {
    map.fitBounds(gpxLayer.getBounds(), {
        paddingBottomRight: [40, 40]
    });
});

var gpxTimeLayer = L.timeDimension.layer.geoJson(gpxLayer, {
    updateTimeDimension: true,
    addlastPoint: true,
    waitForReady: true
});

// add flight to map
gpxTimeLayer.addTo(map);

// creat graph and add
var div = document.createElement("div");
div.style.height = "100px";
div.innerHTML = "Hello";
// console.log(customLayer);
document.getElementById("graph").appendChild(div);