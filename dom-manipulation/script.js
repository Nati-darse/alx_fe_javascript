// Array to hold quote objects
const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "Happiness is not something ready made. It comes from your own actions.", category: "Happiness" },
  ];
  
  // Retrieve quotes and last selected filter from localStorage
  let savedQuotes = JSON.parse(localStorage.getItem("quotes")) || quotes;
  let lastSelectedCategory = localStorage.getItem("lastSelectedCategory") || "all";
  
  // Function to dynamically create the category filter dropdown
  function populateCategories() {
    const categoryFilter = document.createElement("select");
    categoryFilter.id = "categoryFilter";
    categoryFilter.onchange = filterQuotes; // Attach filter function
    document.body.insertBefore(categoryFilter, document.getElementById("quoteDisplay"));
  
    // Add the "All Categories" option
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Categories";
    categoryFilter.appendChild(allOption);
  
    // Extract unique categories from the quotes array
    const categories = [...new Set(savedQuotes.map((quote) => quote.category))];
  
    // Populate the dropdown with categories
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  
    // Restore the last selected category filter
    categoryFilter.value = lastSelectedCategory;
    filterQuotes(); // Apply the last filter on page load
  }
  
  // Function to display quotes based on the selected category
  function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
  
    // Save the selected category to localStorage
    localStorage.setItem("lastSelectedCategory", selectedCategory);
  
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ""; // Clear the current display
  
    // Filter the quotes based on the selected category
    const filteredQuotes =
      selectedCategory === "all"
        ? savedQuotes
        : savedQuotes.filter((quote) => quote.category === selectedCategory);
  
    // Update the DOM with the filtered quotes
    if (filteredQuotes.length > 0) {
      filteredQuotes.forEach((quote) => {
        const quoteElement = document.createElement("div");
        quoteElement.innerHTML = `
          <p>"${quote.text}"</p>
          <small>Category: <strong>${quote.category}</strong></small>
        `;
        quoteElement.style.marginBottom = "20px";
        quoteDisplay.appendChild(quoteElement);
      });
    } else {
      quoteDisplay.innerHTML = "<p>No quotes available for the selected category.</p>";
    }
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
    // Validate inputs
    if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
      savedQuotes.push(newQuote); // Add the new quote to the array
      localStorage.setItem("quotes", JSON.stringify(savedQuotes)); // Update localStorage
  
      // Check if the category is new and add it to the dropdown if necessary
      const categoryFilter = document.getElementById("categoryFilter");
      if (![...categoryFilter.options].some((option) => option.value === newQuoteCategory)) {
        const newOption = document.createElement("option");
        newOption.value = newQuoteCategory;
        newOption.textContent = newQuoteCategory;
        categoryFilter.appendChild(newOption);
      }
  
      // Clear the input fields and alert the user
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      alert("New quote added successfully!");
  
      // Apply the current filter to include the new quote
      filterQuotes();
    } else {
      alert("Please enter both a quote and a category.");
    }
  }
  
  // Function to dynamically create the form for adding new quotes
  function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.style.marginTop = "20px";
  
    const inputQuoteText = document.createElement("input");
    inputQuoteText.id = "newQuoteText";
    inputQuoteText.type = "text";
    inputQuoteText.placeholder = "Enter a new quote";
    inputQuoteText.style.marginRight = "10px";
  
    const inputQuoteCategory = document.createElement("input");
    inputQuoteCategory.id = "newQuoteCategory";
    inputQuoteCategory.type = "text";
    inputQuoteCategory.placeholder = "Enter quote category";
    inputQuoteCategory.style.marginRight = "10px";
  
    const addQuoteButton = document.createElement("button");
    addQuoteButton.textContent = "Add Quote";
    addQuoteButton.onclick = addQuote;
  
    formContainer.appendChild(inputQuoteText);
    formContainer.appendChild(inputQuoteCategory);
    formContainer.appendChild(addQuoteButton);
    document.body.appendChild(formContainer);
  }
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * savedQuotes.length);
    const randomQuote = savedQuotes[randomIndex];
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `
      <p>"${randomQuote.text}"</p>
      <small>Category: <strong>${randomQuote.category}</strong></small>
    `;
  }
  
  // Initialize the app
  createAddQuoteForm(); // Create the form for adding quotes
  populateCategories(); // Populate the category filter dropdown
  document.getElementById("newQuote").addEventListener("click", showRandomQuote); // Attach random quote event
  