document.addEventListener('DOMContentLoaded', function() {
  // Get a reference to the form element
  const searchForm = document.getElementById('searchForm');

  // Add an event listener for form submission
  searchForm.addEventListener('submit', function(event) {
    console.log("Form submitted");  // Debugging line
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the search query from the form
    const searchQuery = document.getElementById('searchQuery').value;

    // Create the data object
    const data = {
      searchQuery: searchQuery
    };

    // Make a POST request to the Firebase Cloud Function (handleSearch)
    console.log("About to make fetch call to handleSearch");  // Debugging line
    fetch('https://us-central1-prospexa-production.cloudfunctions.net/handleSearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success from handleSearch:', data);

      // Make a POST request to the Firebase Cloud Function (aggregateApiCalls)
      console.log("About to make fetch call to aggregateApiCalls");  // Debugging line
      return fetch('https://us-central1-prospexa-production.cloudfunctions.net/aggregateApiCalls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Add any necessary data for aggregateApiCalls here
      });
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success from aggregateApiCalls:', data);

      // Populate the frontend
      document.getElementById('firebaseDataElement').innerText = JSON.stringify(data.firebaseData);
      document.getElementById('rapidDataElement').innerText = JSON.stringify(data.rapidData);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    return false;  // Prevent the default form submission behavior
  });
});
