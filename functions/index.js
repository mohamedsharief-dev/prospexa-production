/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const axios = require('axios'); // Import Axios for making HTTP requests
const cors = require('cors'); // Import the CORS library

const corsHandler = cors({origin: true}); // Initialize CORS middleware

// handleSearch Function - This function handles the form submission
exports.handleSearch = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {  // Wrap your function logic inside corsHandler
    try {
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      const searchQuery = req.body.searchQuery;

      if (!searchQuery) {
        res.status(400).send("Search query cannot be empty.");
        return;
      }

      console.log("Received search query:", searchQuery);

      // You can perform any processing or database operations here

      // Send a response
      res.status(200).json({ message: `Received search query: ${searchQuery}` });
    } catch (error) {
      console.error("Error handling search query:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});


// New function to aggregate API calls
exports.aggregateApiCalls = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {  // Wrap your function logic inside corsHandler
    try {
      // Call your existing Firebase function first (handleSearch)
      // This part assumes that handleSearch and aggregateApiCalls are deployed in the same Firebase project
      const firebaseResponse = await axios.post('https://us-central1-prospexa-production.cloudfunctions.net/handleSearch', { /* your data */ });
      const searchQuery = firebaseResponse.data.message; // Assume the search query is here

      // Then call the RapidAPI endpoint
      const rapidOptions = {
        method: 'GET',
        url: 'https://local-business-data.p.rapidapi.com/search',
        params: { query: searchQuery /*, other params */ },
        headers: { 'X-RapidAPI-Key': '4d63a58758msh683778da742ab1cp1bdf74jsn656a9a0bfe87', 'X-RapidAPI-Host': 'local-business-data.p.rapidapi.com' }
      };

      const rapidResponse = await axios.request(rapidOptions);

      // Return the aggregated data to the client
      res.json({ firebaseData: firebaseResponse.data, rapidData: rapidResponse.data });
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).send('An error occurred');
    }
  });
});
