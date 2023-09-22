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
const axios = require('axios');  // Import Axios for making HTTP requests
const cors = require('cors');  // Import the CORS library

const corsHandler = cors({origin: true});  // Initialize CORS middleware

// New function to call RapidAPI directly
exports.aggregateApiCalls = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {  // Wrap your function logic inside corsHandler
    try {
      const searchQuery = req.body.searchQuery;  // Extract search query from request body

      if (!searchQuery) {
        res.status(400).send("Search query cannot be empty.");
        return;
      }

      // Call the RapidAPI endpoint
      const rapidOptions = {
        method: 'GET',
        url: 'https://local-business-data.p.rapidapi.com/search',
        params: { query: searchQuery /*, other params */ },
        headers: {
          'X-RapidAPI-Key': '4d63a58758msh683778da742ab1cp1bdf74jsn656a9a0bfe87',  // Replace with your actual API key
          'X-RapidAPI-Host': 'local-business-data.p.rapidapi.com'
        }
      };

      const rapidResponse = await axios.request(rapidOptions);

      // Return the data to the client
      res.json({ rapidData: rapidResponse.data });
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).send('An error occurred');
    }
  });
});
