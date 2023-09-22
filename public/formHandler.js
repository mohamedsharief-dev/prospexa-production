// Add this script at the end of your HTML or in a separate JS file

document.addEventListener('DOMContentLoaded', function() {
  // Get a reference to the form element
  const searchForm = document.getElementById('searchForm');
  
  // Add an event listener for form submission
  searchForm.addEventListener('submit', function(event) {
      console.log("Form submitted");  // Debugging line
      event.preventDefault(); // Prevent the default form submission behavior

      // Moved these lines above the 'return false;' line
      // Get the search query from the form
      const searchQuery = document.getElementById('searchQuery').value;
      
      // Create the data object
      const data = {
        searchQuery: searchQuery
      };

      // Make a POST request to the Firebase Cloud Function
      console.log("About to make fetch call");  // Debugging line
      fetch('https://us-central1-prospexa-production.cloudfunctions.net/handleSearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

      return false;  // Moved this line to the end, if needed
  });
});
