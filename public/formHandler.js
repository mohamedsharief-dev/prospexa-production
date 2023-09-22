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

      // Reset specific elements inside existing cards
      for (let i = 1; i <= maxCards; i++) {
        let titleElement = document.getElementById(`businessinfotitle${i}`);
        let webElement = document.getElementById(`businesswebaddress${i}`);
        let phoneElement = document.getElementById(`businessphoneaddress${i}`);

        if (titleElement) titleElement.innerText = '';
        if (webElement) webElement.innerText = '';
        if (phoneElement) phoneElement.innerText = '';
      }

      // Iterate through the filtered data and populate the HTML cards
      for (let i = 0; i < Math.min(data.filteredData.length, maxCards); i++) {
        let item = data.filteredData[i];
        console.log(`Populating card ${i + 1} with:`, item);  // Debugging line

        let titleElement = document.getElementById(`businessinfotitle${i + 1}`);
        let webElement = document.getElementById(`businesswebaddress${i + 1}`);
        let phoneElement = document.getElementById(`businessphoneaddress${i + 1}`);

        if (titleElement) {
          titleElement.innerText = item.name;
        } else {
          console.error(`businessinfotitle${i + 1} not found`);
        }

        if (webElement) {
          webElement.href = item.website;
          webElement.innerText = "Company Website";
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
