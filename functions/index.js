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
        params: { query: searchQuery, limit: 10 },  // Limit to 10 results
        headers: {
          'X-RapidAPI-Key': '4d63a58758msh683778da742ab1cp1bdf74jsn656a9a0bfe87',  // Replace with your actual API key
          'X-RapidAPI-Host': 'local-business-data.p.rapidapi.com'
        }
      };

      const rapidResponse = await axios.request(rapidOptions);

      // Filter and limit the data
      const filteredData = rapidResponse.data.data.slice(0, 10).map((item, index) => ({
        id: index,  // Assigning an index as an ID
        phoneNumber: item.phone_number,
        website: item.website,
        name: item.name
      }));

      // Return the filtered data to the client
      res.json({ filteredData });
      
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).send('An error occurred');
    }
  });
});

