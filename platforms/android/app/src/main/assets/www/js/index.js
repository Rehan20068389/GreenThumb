/*
 * GreenThumb App Logic
 * Handles initialization, Camera, and Geolocation.
 */

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    onDeviceReady: function () {
        console.log('Device is Ready');
        this.bindEvents();
    },

    bindEvents: function () {
        // Camera Button
        $('#btn-camera').on('click', this.takePicture);

        // Geolocation Button
        $('#btn-geo').on('click', this.getLocation);

        // Send Button
        $('#btn-send').on('click', function () {
            alert('SENT SUCCESS:\n\nYour plant photo has been sent to our specialists. We will reply within 24 hours!');

        });
    },

    // -----------------------------------
    // CAMERA FEATURE
    // -----------------------------------
    takePicture: function () {
        if (!navigator.camera) {
            alert("Camera API not supported in this environment (Browser?).");
            return;
        }

        navigator.camera.getPicture(
            function (imageData) {
                // Success Callback
                var image = document.getElementById('myImage');
                image.style.display = "block";
                image.src = "data:image/jpeg;base64," + imageData;
                $('#btn-send').prop('disabled', false).button('refresh');
            },
            function (message) {
                // Error Callback
                alert('Failed because: ' + message);
            },
            {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                encodingType: Camera.EncodingType.JPEG,
                correctOrientation: true
            }
        );
    },

    // -----------------------------------
    // GEOLOCATION FEATURE
    // -----------------------------------
    getLocation: function () {
        $('#geo-results').show();
        $('#lat').text("Locating...");
        $('#long').text("Locating...");

        if (!navigator.geolocation) {
            $('#dist-msg').text("Geolocation API not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            function (position) {
                // Success
                var lat = position.coords.latitude;
                var long = position.coords.longitude;

                $('#lat').text(lat.toFixed(4));
                $('#long').text(long.toFixed(4));

                // Calculate distance to Store (Dummy Store Coordinates: Central Park, NY)
                var storeLat = 40.785091;
                var storeLong = -73.968285;

                var dist = app.getDistanceFromLatLonInKm(lat, long, storeLat, storeLong);

                $('#dist-msg').html("Distance to Store: <strong>" + dist.toFixed(2) + " km</strong>");

                // Add Map Button
                var mapUrl = "geo:" + storeLat + "," + storeLong + "?q=" + storeLat + "," + storeLong + "(GreenThumb Nursery)";
                $('#map-canvas').html('<a href="' + mapUrl + '" class="ui-btn ui-btn-b ui-corner-all ui-icon-navigation ui-btn-icon-left">View Store on Map</a>');
            },
            function (error) {
                // Error
                $('#dist-msg').text("Error: " + error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    },

    // Haversine Formula for Distance Calculation
    getDistanceFromLatLonInKm: function (lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = app.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = app.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(app.deg2rad(lat1)) * Math.cos(app.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    },

    deg2rad: function (deg) {
        return deg * (Math.PI / 180)
    }
};

app.initialize();
