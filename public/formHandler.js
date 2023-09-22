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

      // Clear existing cards if any
      document.getElementById('resultsContainer').innerHTML = '';

      // Populate the frontend with cards
      // Assuming data.filteredData contains the response from RapidAPI
      data.filteredData.forEach((item, index) => {
        // Create a card-like div for each item
        const card = document.createElement('div');
        card.classList.add('card');  // Assuming "card" is a CSS class you've defined

        // Populate the card with data
        card.innerHTML = `
          <h3>${item.name}</h3>
          <p>Phone: ${item.phoneNumber}</p>
          <p>Website: <a href="${item.website}" target="_blank">${item.website}</a></p>
        `;

        // Append the card to a container div (you should have this in your HTML)
        document.getElementById('resultsContainer').appendChild(card);
      });
      
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    return false;  // Prevent the default form submission behavior
  });
});
