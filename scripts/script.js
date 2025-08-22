// Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsSection = document.getElementById('results');

// Current category filter state
let currentCategory = 'all';
let wasteData = []; // filled from JSON

// Load JSON data on page load
window.addEventListener('DOMContentLoaded', () => {
  fetch('data/waste_items.json') // your JSON file path
    .then(response => response.json())
    .then(data => {
      wasteData = data;
      // Show empty state initially
      resultsSection.innerHTML = '<p>No results yet. Type an item above to see how to dispose of it.</p>';
    })
    .catch(err => {
      resultsSection.innerHTML = '<p>Failed to load data. Please try again later.</p>';
      console.error('Error loading JSON:', err);
    });
});

// Render results
function renderResults(items) {
  if (!items || items.length === 0) {
    resultsSection.innerHTML = '<p>No results found. Try checking your spelling or searching for a similar term.</p>';
    return;
  }

  const html = items.map(item => {
    return `
      <div class="card">
        <strong>${item.item}</strong> <span class="badge">${item.category}</span>
        <p><strong>Method:</strong> ${item.method}</p>
        <p><small>Tip: ${item.tip}</small></p>
      </div>
    `;
  }).join('');

  resultsSection.innerHTML = html;
}

// Filter based on search term and category
function filterAndRender() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = wasteData.filter(item => {
    const matchesSearch = item.item.toLowerCase().includes(query);
    const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
    return matchesSearch && matchesCategory;
  });

  renderResults(filtered);
}

// Search button / Enter key
function searchItems() {
  filterAndRender();
}

// Filter by category buttons
function filterByCategory(category) {
  currentCategory = category;
  filterAndRender();
}

// Browse all items button
function browseAllItems() {
  currentCategory = 'all';
  searchInput.value = '';
  renderResults(wasteData);
}

// Event listeners
searchBtn.addEventListener('click', searchItems);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchItems();
});

// Expose category/browse functions to HTML buttons
window.filterByCategory = filterByCategory;
window.browseAllItems = browseAllItems;
