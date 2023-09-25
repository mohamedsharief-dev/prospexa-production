document.addEventListener('DOMContentLoaded', function() {

  const searchForm = document.getElementById('searchForm');
  searchForm.addEventListener('submit', function(event) {
    console.log("Form submitted");
    event.preventDefault();

    const searchQuery = document.getElementById('searchQuery').value;

    const data = {
      searchQuery: searchQuery
    };

    console.log("About to make fetch call to aggregateApiCalls");
    fetch('https://us-central1-prospexa-production.cloudfunctions.net/aggregateApiCalls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success from aggregateApiCalls:', data);

      const maxCards = 2;

      for (let i = 1; i <= maxCards; i++) {
        let titleElement = document.getElementById(`businessinfotitle${i}`);
        let webElement = document.getElementById(`businesswebaddress${i}`);
        let phoneElement = document.getElementById(`businessphoneaddress${i}`);

        if (titleElement) titleElement.innerText = '';
        if (webElement) webElement.innerText = '';
        if (phoneElement) phoneElement.innerText = '';
      }

      for (let i = 0; i < Math.min(data.filteredData.length, maxCards); i++) {
        let item = data.filteredData[i];
        console.log(`Populating card ${i + 1} with:`, item);

        let titleElement = document.getElementById(`businessinfotitle${i + 1}`);
        let webElement = document.getElementById(`businesswebaddress${i + 1}`);
        let phoneElement = document.getElementById(`businessphoneaddress${i + 1}`);

        if (titleElement) titleElement.innerText = item.name;
        if (webElement) webElement.href = item.website;
        webElement.innerText = 'Company Website';  // <-- Add this line here
        if (phoneElement) phoneElement.innerText = item.phoneNumber;
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    return false;
  });

  const updateLogoImage = async (businessWebAddressID, newDomain) => {
    const logoID = `logo${businessWebAddressID}`;
    const imgElement = document.getElementById(logoID);

    try {
      const response = await axios.get(`https://api.microlink.io?url=${encodeURIComponent(newDomain)}`);
      if (response.data.status === 'success') {
        const logoEndpoint = response.data.data.logo.url;
        imgElement.src = logoEndpoint;
      } else {
        console.log('Failed to fetch logo from Microlink API');
      }
    } catch (error) {
      console.log('An error occurred while fetching the logo:', error);
    }
  };

  const businessWebAddressIDs = ['businesswebaddress1', 'businesswebaddress2'];
  
  businessWebAddressIDs.forEach(id => {
    const businessWebAddressElement = document.getElementById(id);

    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
          let newDomain = businessWebAddressElement.getAttribute('href');
          const urlObj = new URL(newDomain);
          newDomain = 'https://' + urlObj.hostname;
          updateLogoImage(id.replace('businesswebaddress', ''), newDomain);
        }
      });
    });
  
    observer.observe(businessWebAddressElement, {
      attributes: true,
    });
  });
});
