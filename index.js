// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXYiEWGstUQFNhbviS9HkNQusqVpDhzaA",
  authDomain: "prospexa-production.firebaseapp.com",
  projectId: "prospexa-production",
  storageBucket: "prospexa-production.appspot.com",
  messagingSenderId: "1013328460295",
  appId: "1:1013328460295:web:b72a2166dbfbcc973f08a2",
  measurementId: "G-ENC4JRGDSP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// No analytics initialization here because it's not compatible with Node.js
