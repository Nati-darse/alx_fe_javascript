const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API

// Retrieve quotes from localStorage or use default quotes
let savedQuotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "Happiness is not something ready made. It comes from your own actions.", category: "Happiness" },
];

// Retrieve last selected category
let lastSelectedCategory = localStorage.getItem("lastSelectedCategory") || "all";

/** 🛠 Function to populate categories in the dropdown **/
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const uniqueCategories = new Set(savedQuotes.map(quote => quote.category));

    // Clear existing options
    categoryFilter.innerHTML = "";

    // Add "All" option
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All";
    categoryFilter.appendChild(allOption);

    // Add unique categories to the dropdown
    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Set the last selected category
    categoryFilter.value = lastSelectedCategory;
}

/** 🛠 Function to fetch quotes from the server **/
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch quotes from server.");
        const serverQuotes = await response.json();

        // Convert API data to match our format
        const formattedQuotes = serverQuotes.map(q => ({
            text: q.title,
            category: "General"
        }));

        // Merge and resolve conflicts
        mergeQuotes(formattedQuotes);
    } catch (error) {
        console.error("Error fetching server quotes:", error);
    }
}

/** 🛠 Function to manually sync quotes with the server **/
async function syncQuotes() {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(savedQuotes),
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Failed to sync with server.");
        
        notifyUser("Quotes synced with server!");
    } catch (error) {
        console.error("Error syncing quotes with server:", error);
    }
}

/** 🛠 Function to merge server and local quotes **/
function mergeQuotes(serverQuotes) {
    let updatedQuotes = [...savedQuotes];

    serverQuotes.forEach(serverQuote => {
        const exists = savedQuotes.some(localQuote => localQuote.text === serverQuote.text);
        if (!exists) {
            updatedQuotes.push(serverQuote);
            notifyUser(`New quote added: "${serverQuote.text}" from server`);
        }
    });

    // Save merged quotes to localStorage
    savedQuotes = updatedQuotes;
    saveQuotes(); // Save to local storage
}

/** 🛠 Save quotes to local storage **/
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(savedQuotes));
    populateCategories(); // Update categories in the dropdown
    filterQuotes();
}

/** 🛠 Function to handle conflicts (server vs local) **/
function resolveConflicts(serverQuotes) {
    const conflicts = serverQuotes.filter(serverQuote =>
        savedQuotes.some(localQuote => localQuote.text === serverQuote.text && localQuote.category !== serverQuote.category)
    );

    if (conflicts.length > 0) {
        notifyUser(`⚠️ Conflict detected in ${conflicts.length} quotes!`);
        conflicts.forEach(conflict => {
            console.warn("Conflict:", conflict);
        });

        // Prefer server version
        conflicts.forEach(conflict => {
            savedQuotes = savedQuotes.map(quote =>
                quote.text === conflict.text ? conflict : quote
            );
        });

        saveQuotes();
    }
}

/** 🛠 Function to notify user of updates **/
function notifyUser(message) {
    alert(message);
}

/** 🛠 Function to display quotes based on selected category **/
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("lastSelectedCategory", selectedCategory);

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";

    const filteredQuotes =
        selectedCategory === "all"
            ? savedQuotes
            : savedQuotes.filter((quote) => quote.category === selectedCategory);

    if (filteredQuotes.length > 0) {
        filteredQuotes.forEach((quote) => {
            const quoteElement = document.createElement("div");
            quoteElement.innerHTML = `<p>"${quote.text}"</p><small>Category: <strong>${quote.category}</strong></small>`;
            quoteElement.style.marginBottom = "20px";
            quoteDisplay.appendChild(quoteElement);
        });
    } else {
        quoteDisplay.innerHTML = "<p>No quotes available for the selected category.</p>";
    }
}

/** 🛠 Function to add a new quote **/
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        savedQuotes.push(newQuote);
        saveQuotes(); // Save to local storage

        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        alert("New quote added successfully!");
        filterQuotes();
    } else {
        alert("Please enter both a quote and a category.");
    }
}

/** 🛠 Function to dynamically create the form for adding new quotes **/
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

/** 🛠 Function to display a random quote **/
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * savedQuotes.length);
    const randomQuote = savedQuotes[randomIndex];
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><small>Category: <strong>${randomQuote.category}</strong></small>`;
}

/** 🛠 Function to export quotes to JSON file **/
function exportToJson() {
    const dataStr = JSON.stringify(savedQuotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/** 🛠 Function to import quotes from JSON file **/
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        savedQuotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

/** 🛠 Initialize the app **/
createAddQuoteForm();
populateCategories(); // Populate categories on app init
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Attach sync function to button (if exists)
const syncButton = document.getElementById("syncQuotes");
if (syncButton) {
    syncButton.addEventListener("click", syncQuotes);
}

// Attach export functionality
const exportButton = document.getElementById("exportQuotes");
if (exportButton) {
    exportButton.addEventListener("click", exportToJson);
}

// Attach import functionality
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// Fetch server quotes every 10 sec
setInterval(fetchQuotesFromServer, 10000);

// Sync before the user leaves the page
window.addEventListener("beforeunload", syncQuotes);