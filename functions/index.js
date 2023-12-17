const {onRequest} = require("firebase-functions/v2/https");
const functions = require("firebase-functions");
functions.config().firebase = {storageBucket: "bucket-name.appspot.com"};
functions.setup("us-central1", {
  maxInstances: 10, // Set a lower maximum instances value
});

const googleMapsClient = require("@google/maps").createClient({
  key: functions.config().googleapi.key,
  Promise: Promise,
});


exports.findPlaces = onRequest((request, response) => {
  const businessType = request.query.businessType;
  const location = request.query.location;

  googleMapsClient.placesNearby({
    location: location,
    radius: 1000, // Modify radius as needed
    type: businessType,
  })
      .asPromise()
      .then((res) => {
        response.send(res.json.results);
      })
      .catch((err) => {
        response.status(500).send(err);
      });
});
