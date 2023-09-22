// formHandler.js
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    const form = document.getElementById("searchForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const searchQuery = e.target.searchQuery.value;
      
      try {
        const response = await fetch("/functions/handleSearch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ searchQuery }),
        });
        
        const data = await response.json();
        console.log(data);
        // Handle success - update UI
      } catch (error) {
        console.error(error);
        // Handle error - update UI
      }
    });
  });
  