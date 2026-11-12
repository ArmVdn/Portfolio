const exploreTools = document.getElementById("explore-tools");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const destinationGrid = document.getElementById("destination-grid");
const resultsCount = document.getElementById("results-count");
const noResults = document.getElementById("no-results");
const resetButton = document.getElementById("reset-search");
const filterButtons = document.querySelectorAll(".filter-button");

let selectedCategory = "alles";

// Maak zoektermen vergelijkbaar, ook met hoofdletters en accenten.
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const destinations = Array.from(
  destinationGrid.querySelectorAll(".destination-card"),
).map(function (card) {
  return {
    element: card,
    category: card.dataset.category,
    text: normalizeText(card.textContent),
  };
});

// Combineer de zoekopdracht met de gekozen categorie.
function updateDestinations() {
  const query = normalizeText(searchInput.value);
  const words = query === "" ? [] : query.split(" ");
  let visibleCount = 0;

  destinations.forEach(function (destination) {
    const matchesCategory =
      selectedCategory === "alles" || destination.category === selectedCategory;

    const matchesSearch = words.every(function (word) {
      return destination.text.includes(word);
    });

    const isVisible = matchesCategory && matchesSearch;
    destination.element.hidden = !isVisible;

    if (isVisible) {
      visibleCount++;
    }
  });

  resultsCount.textContent =
    visibleCount + " " + (visibleCount === 1 ? "bestemming" : "bestemmingen");

  destinationGrid.hidden = visibleCount === 0;
  noResults.hidden = visibleCount !== 0;

  filterButtons.forEach(function (button) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === selectedCategory),
    );
  });
}

// Zoeken werkt tijdens het typen en met de zoekknop of Enter.
searchInput.addEventListener("input", updateDestinations);

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  updateDestinations();
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    selectedCategory = button.dataset.filter;
    updateDestinations();
  });
});

// Wis de zoekopdracht en toon opnieuw alle categorieën.
resetButton.addEventListener("click", function () {
  searchForm.reset();
  selectedCategory = "alles";
  updateDestinations();
  searchInput.focus();
});

updateDestinations();
exploreTools.hidden = false;
