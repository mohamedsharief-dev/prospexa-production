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

    // Make a POST request to the Firebase Cloud Function (aggregateApiCalls)
    console.log("About to make fetch call to aggregateApiCalls");  // Debugging line
    fetch('https://us-central1-prospexa-production.cloudfunctions.net/aggregateApiCalls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)  // Sending the data object
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success from aggregateApiCalls:', data);

      // New Debugging Line: Check the integrity of returned data
      console.log("Data to be populated:", data.filteredData);

      // Define the maximum number of cards you have
      const maxCards = 2;

      // Clear existing cards if any
      for (let i = 1; i <= maxCards; i++) {
        const cardContainer = document.getElementById(`resultscard${i}`);
        if (cardContainer) {
          cardContainer.innerHTML = '';
        }
      }

      // Iterate through the filtered data and populate the HTML cards
      // Limit the loop to the number of cards you actually have
      for (let i = 0; i < Math.min(data.filteredData.length, maxCards); i++) {
        let item = data.filteredData[i];
        // New Debugging Lines: Log each item to be populated
        console.log(`Populating card ${i + 1} with:`, item);
        
        document.getElementById(`businessinfotitle${i + 1}`).innerText = item.name;
        document.getElementById(`businesswebaddress${i + 1}`).innerText = `🌐 Website; ${item.website}`;
        document.getElementById(`businessphoneaddress${i + 1}`).innerText = `📞 Sales Phone Number; ${item.phoneNumber}`;
      }
    })
    .catch((error) => {
      console.error('Error:', error);

      // New Error Handling: Show error in the first result card
      const firstCard = document.getElementById('resultscard1');
      if (firstCard) {
        firstCard.innerHTML = '<p>An error occurred while fetching data.</p>';
      }
    });

    return false;  // Prevent the default form submission behavior
  });
});
