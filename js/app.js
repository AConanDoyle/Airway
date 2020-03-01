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
    transitionTime: 200,
    loop: true,
    startOver: false
}, timeDimension);

// options player control
var timeDimensionControlOptions = {
    player: player,
    title: "Airways",
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

// creat custom geoJSON Layer for BER to ZAG
var gjsonLayerBERZAG = L.geoJson(null, {
    pointToLayer: function (feature, latLng) {
        if (feature.properties.hasOwnProperty('last')) {
            return new L.Marker(latLng, {
                icon: iconPlane
            });
        }
        return L.circleMarker(latLng);
    }
});

// and ZAG to PRA
var gjsonLayerZAGPRA = L.geoJson(null, {
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
// Berlin to Zagreb
var gpxBER_ZAG = omnivore.gpx('data/BER-ZAG_2019-NOV.gpx', null, gjsonLayerBERZAG).on('ready', function () {
    map.fitBounds(gpxBER_ZAG.getBounds(), {
        paddingBottomRight: [40, 40]
    });
});

// add gpx-layer to time layer with some options
var gpxTimeBer_ZAG = L.timeDimension.layer.geoJson(gpxBER_ZAG, {
    updateTimeDimension: true,
    addlastPoint: true,
    waitForReady: true
});

// add gpx-layer to time layer with some options, Zagreb to Prague
var gpxTimeZAG_PRA = L.timeDimension.layer.geoJson(omnivore.gpx('data/ZAG-PRA_2019-APR.gpx', null, gjsonLayerZAGPRA), {
    updateTimeDimension: true,
    addlastPoint: true,
    waitForReady: true
});

var overlayAirways = {
    "Berlin to Zagreb": gpxTimeBer_ZAG,
    "Zagreb to Prague": gpxTimeZAG_PRA,
};

// add flight to map
// var baseLayers = getCommonBaseLayers(map); // see baselayers.js
L.control.layers(overlayAirways, null).addTo(map);
gpxTimeBer_ZAG.addTo(map);