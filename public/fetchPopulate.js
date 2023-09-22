// Client-side JavaScript to call aggregateApiCalls
fetch('https://us-central1-prospexa-production.cloudfunctions.net/aggregateApiCalls', {
  method: 'POST',  // or GET, depending on how you've set it up
  headers: {
    'Content-Type': 'application/json',
  },
  // Include any necessary data in the body
})
.then(response => response.json())
.then(data => {
  // Handle the aggregated data here
  console.log('Received data:', data);

  // Populate the frontend
  // For example, inserting data into DOM elements
  document.getElementById('firebaseDataElement').innerText = JSON.stringify(data.firebaseData);
  document.getElementById('rapidDataElement').innerText = JSON.stringify(data.rapidData);
})
.catch((error) => {
  console.error('Error:', error);
});
