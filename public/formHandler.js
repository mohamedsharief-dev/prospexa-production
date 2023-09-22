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
      console.log('Success from aggregateApiCalls:', data);  // Debugging line

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
        console.log(`Populating card ${i + 1} with:`, item);  // Debugging line

        // New Error Handling: Check if each element exists before updating it
        let titleElement = document.getElementById(`businessinfotitle${i + 1}`);
        let webElement = document.getElementById(`businesswebaddress${i + 1}`);
        let phoneElement = document.getElementById(`businessphoneaddress${i + 1}`);

        if (titleElement) {
          titleElement.innerText = item.name;
        } else {
          console.error(`businessinfotitle${i + 1} not found`);
        }

        if (webElement) {
          webElement.innerText = item.website;
        } else {
          console.error(`businesswebaddress${i + 1} not found`);
        }

        if (phoneElement) {
          phoneElement.innerText = item.phoneNumber;
        } else {
          console.error(`businessphoneaddress${i + 1} not found`);
        }
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    return false;  // Prevent the default form submission behavior
  });
});
