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

// formHandler Function - This function handles the form submission
exports.handleSearch = functions.https.onRequest((req, res) => {
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
