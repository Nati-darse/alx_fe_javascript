const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "Happiness is not something ready made. It comes from your own actions.", category: "Happiness" },
  ];
  
  function createAddQuoteForm() {
    const body = document.body;
  
    // Create the container for the form
    const formContainer = document.createElement("div");
    formContainer.style.marginTop = "20px";
  
    // Create the input for the quote text
    const inputQuoteText = document.createElement("input");
    inputQuoteText.id = "newQuoteText";
    inputQuoteText.type = "text";
    inputQuoteText.placeholder = "Enter a new quote";
    inputQuoteText.style.marginRight = "10px";
  
    // Create the input for the quote category
    const inputQuoteCategory = document.createElement("input");
    inputQuoteCategory.id = "newQuoteCategory";
    inputQuoteCategory.type = "text";
    inputQuoteCategory.placeholder = "Enter quote category";
    inputQuoteCategory.style.marginRight = "10px";
  
    // Create the button to add the new quote
    const addQuoteButton = document.createElement("button");
    addQuoteButton.textContent = "Add Quote";
    addQuoteButton.onclick = addQuote; 
  
    formContainer.appendChild(inputQuoteText);
    formContainer.appendChild(inputQuoteCategory);
    formContainer.appendChild(addQuoteButton);
  
    body.appendChild(formContainer);
  }
  
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
  
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `
      <p>"${randomQuote.text}"</p>
      <small>Category: <strong>${randomQuote.category}</strong></small>
    `;
  }
  
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
  
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
  
      alert("New quote added successfully!");
    } else {
      alert("Please enter both a quote and a category.");
    }
  }
  
  createAddQuoteForm();
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  