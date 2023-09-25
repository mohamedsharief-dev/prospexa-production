document.addEventListener('DOMContentLoaded', function() {
  
// Fetch social media links based on a given website URL
const fetchSocialMediaLinks = async (websiteUrl, cardNumber) => {
  try {
    const response = await fetch('https://us-central1-prospexa-production.cloudfunctions.net/getSocialMediaLinks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ websiteUrl })
    });

    const data = await response.json();
    const socialMediaLinks = data.socialMediaLinks;

    console.log(`Social Media Links for ${websiteUrl}:`, socialMediaLinks);
    
    // Count the number of available social media links
    let count = 0;
    for (const key in socialMediaLinks) {
      if (socialMediaLinks.hasOwnProperty(key) && socialMediaLinks[key]) {
        count++;
      }
    }

    // Update the HTML element with the count
    const socialMediaCountElement = document.getElementById(`socialmediaCount${cardNumber}`);
    const socialMediaLinksElement = document.getElementById(`socialMediaLinks${cardNumber}`);
    
    if (socialMediaCountElement) {
      socialMediaCountElement.innerText = count;
    }
// Populate individual links
if (socialMediaLinksElement) {
  socialMediaLinksElement.innerHTML = '';
  for (const [platform, url] of Object.entries(socialMediaLinks)) {
    if (url) {
      socialMediaLinksElement.innerHTML += `
        <div class="social-media-item">
          <a href="${url}" target="_blank">
            <img src="images/${platform}.webp" alt="${platform}" style="max-width:15px; margin-right: 8px;">
            ${platform}
          </a>
        </div>
      `;
    }
  }
}


  } catch (error) {
    console.error('Error fetching social media links:', error);
  }
};

// Add click event to the div where the count is shown
document.getElementById('socialMediaInfo1').addEventListener('click', function() {
  const socialMediaLinksElement = document.getElementById('socialMediaLinks1');
  socialMediaLinksElement.style.display = socialMediaLinksElement.style.display === 'none' ? 'block' : 'none';
});

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
        if (webElement) {
          webElement.href = item.website;
          fetchSocialMediaLinks(item.website, i + 1);  // Fetch social media links here
        }
        webElement.innerText = 'Company Website';
        if (phoneElement) phoneElement.innerText = item.phoneNumber;
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    return false;
  });

  const updateLogoImage = async (businessWebAddressID, newDomain) => {
    console.log("Attempting to update logo image"); // Debugging line
    const logoID = `logo${businessWebAddressID}`;
    const imgElement = document.getElementById(logoID);
  
    try {
      // Make a POST request to the new Firebase function
      const response = await fetch('https://us-central1-prospexa-production.cloudfunctions.net/fetchCompanyLogo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ websiteUrl: newDomain })
      });
  
      const data = await response.json();
      console.log("Received data from Firebase function:", data); // Debugging line
  
      if (data.logoEndpoint) {
        imgElement.src = data.logoEndpoint;
      } else {
        console.log('Failed to fetch logo from Firebase function');
      }
  
    } catch (error) {
      console.log('An error occurred while fetching the logo:', error);
    }
  };

  const businessWebAddressIDs = ['businesswebaddress1', 'businesswebaddress2'];

businessWebAddressIDs.forEach(id => {
  const businessWebAddressElement = document.getElementById(id);

  const observer = new MutationObserver(function(mutations) {
    console.log("MutationObserver triggered"); // Debugging line
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
