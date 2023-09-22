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

      // Clear existing cards if any
      for (let i = 1; i <= data.filteredData.length; i++) {
        const cardContainer = document.getElementById(`resultscard${i}`);
        if (cardContainer) {
          cardContainer.innerHTML = '';
        } else {
          console.log(`resultscard${i} not found`);
        }
      }
      
      // Iterate through the filtered data and populate the HTML cards
      data.filteredData.forEach((item, index) => {
          // New Debugging Lines: Log each item to be populated
          console.log(`Populating card ${index + 1} with:`, item);
        document.getElementById(`businessinfotitle${index + 1}`).innerText = item.name;
        document.getElementById(`businesswebaddress${index + 1}`).innerText = `🌐 Website; ${item.website}`;
        document.getElementById(`businessphoneaddress${index + 1}`).innerText = `📞 Sales Phone Number; ${item.phoneNumber}`;
      });
      
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
