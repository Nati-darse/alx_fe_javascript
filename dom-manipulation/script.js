const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API

// Retrieve quotes from localStorage or use default quotes
let savedQuotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "Happiness is not something ready made. It comes from your own actions.", category: "Happiness" },
];

let lastSelectedCategory = localStorage.getItem("lastSelectedCategory") || "all";

async function fetchServerQuotes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch quotes from server.");
        const serverQuotes = await response.json();

        // Convert API data to match our format
        const formattedQuotes = serverQuotes.map(q => ({
            text: q.title, // Using 'title' as quote text
            category: "General"
        }));

        mergeQuotes(formattedQuotes);
    } catch (error) {
        console.error("Error fetching server quotes:", error);
    }
}

function mergeQuotes(serverQuotes) {
    let updatedQuotes = [...savedQuotes];

    serverQuotes.forEach(serverQuote => {
        const exists = savedQuotes.some(localQuote => localQuote.text === serverQuote.text);
        if (!exists) {
            updatedQuotes.push(serverQuote);
            notifyUser(`New quote added: "${serverQuote.text}" from server`);
        }
    });

    savedQuotes = updatedQuotes;
    localStorage.setItem("quotes", JSON.stringify(savedQuotes));
    filterQuotes();
}

async function syncWithServer() {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(savedQuotes),
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Failed to sync with server.");
        notifyUser("Quotes successfully synced with server.");
    } catch (error) {
        console.error("Error syncing with server:", error);
    }
}

function resolveConflicts(serverQuotes) {
    const conflicts = serverQuotes.filter(serverQuote =>
        savedQuotes.some(localQuote => localQuote.text === serverQuote.text && localQuote.category !== serverQuote.category)
    );

    if (conflicts.length > 0) {
        notifyUser(`⚠️ Conflict detected in ${conflicts.length} quotes!`);
        conflicts.forEach(conflict => {
            console.warn("Conflict:", conflict);
        });

        conflicts.forEach(conflict => {
            savedQuotes = savedQuotes.map(quote =>
                quote.text === conflict.text ? conflict : quote
            );
        });

        localStorage.setItem("quotes", JSON.stringify(savedQuotes));
        filterQuotes();
    }
}

function notifyUser(message) {
    alert(message);
}

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

function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        savedQuotes.push(newQuote);
        localStorage.setItem("quotes", JSON.stringify(savedQuotes));

        const categoryFilter = document.getElementById("categoryFilter");
        if (![...categoryFilter.options].some((option) => option.value === newQuoteCategory)) {
            const newOption = document.createElement("option");
            newOption.value = newQuoteCategory;
            newOption.textContent = newQuoteCategory;
            categoryFilter.appendChild(newOption);
        }

        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        alert("New quote added successfully!");
        filterQuotes();
    } else {
        alert("Please enter both a quote and a category.");
    }
}

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

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * savedQuotes.length);
    const randomQuote = savedQuotes[randomIndex];
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><small>Category: <strong>${randomQuote.category}</strong></small>`;
}

createAddQuoteForm();
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

setInterval(fetchServerQuotes, 10000);
