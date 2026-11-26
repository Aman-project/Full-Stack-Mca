const searchForm = document.getElementById('search-form');
const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const pills = document.querySelectorAll('.pill');
const resultsBar = document.getElementById('results-bar');
const resultCount = document.getElementById('result-count');
const activeCountry = document.getElementById('active-country');
const filterInput = document.getElementById('filter-input');
const statusPanel = document.getElementById('status-panel');
const directoryList = document.getElementById('directory-list');

// Stores full API response for instant client-side filtering
let universities = [];

// Fetch universities for the given country from Hipolabs API
async function loadUniversities(country) {
  const query = country.trim();
  if (!query) return;

  searchBtn.disabled = true;
  directoryList.innerHTML = '';
  resultsBar.classList.add('hidden');
  filterInput.value = '';
  statusPanel.classList.remove('hidden', 'error');
  statusPanel.textContent = `Searching universities in "${query}"...`;

  const apiUrl = `http://universities.hipolabs.com/search?country=${encodeURIComponent(query)}`;
  // HTTPS proxy fallback prevents mixed-content blocks on HTTPS pages
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;

  try {
    let response;
    try {
      response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Direct fetch failed');
    } catch {
      response = await fetch(proxyUrl);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    universities = Array.isArray(data) ? data : [];

    if (universities.length === 0) {
      statusPanel.textContent = `No universities found for "${query}". Try using the full English country name (e.g., "United States").`;
      return;
    }

    statusPanel.classList.add('hidden');
    resultsBar.classList.remove('hidden');
    activeCountry.textContent = universities[0].country || query;
    renderDirectory(universities);
  } catch {
    statusPanel.classList.add('error');
    statusPanel.textContent = 'Unable to load university records right now. Check your internet connection and try again.';
  } finally {
    searchBtn.disabled = false;
  }
}

// Render university rows using DocumentFragment for fast DOM updates
function renderDirectory(items) {
  directoryList.innerHTML = '';
  resultCount.textContent = items.length;

  if (items.length === 0) {
    statusPanel.classList.remove('hidden', 'error');
    statusPanel.textContent = 'No institutions match your current filter.';
    return;
  }

  statusPanel.classList.add('hidden');
  const fragment = document.createDocumentFragment();

  items.forEach(uni => {
    const row = document.createElement('article');
    row.className = 'uni-row';

    // 1. University Name
    const title = document.createElement('h2');
    title.className = 'uni-title';
    title.textContent = uni.name;

    // 2. State or Province (handles null API values cleanly)
    const stateText = uni['state-province'];
    const stateTag = document.createElement('span');
    stateTag.className = `uni-state${stateText ? '' : ' none'}`;
    stateTag.textContent = stateText ? stateText : 'State / Province N/A';

    // 3. Official Website Links
    const linksWrap = document.createElement('div');
    linksWrap.className = 'uni-links';

    const pages = Array.isArray(uni.web_pages) ? uni.web_pages : [];
    if (pages.length > 0) {
      pages.forEach(site => {
        const anchor = document.createElement('a');
        anchor.className = 'uni-link';
        anchor.href = site;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.textContent = `${site} ↗`;
        linksWrap.appendChild(anchor);
      });
    } else {
      const empty = document.createElement('span');
      empty.className = 'uni-state none';
      empty.textContent = 'No website listed';
      linksWrap.appendChild(empty);
    }

    row.append(title, stateTag, linksWrap);
    fragment.appendChild(row);
  });

  directoryList.appendChild(fragment);
}

// Form submission handler
searchForm.addEventListener('submit', e => {
  e.preventDefault();
  loadUniversities(countryInput.value);
});

// Quick-select country pill handlers
pills.forEach(pill => {
  pill.addEventListener('click', () => {
    const selected = pill.dataset.country;
    countryInput.value = selected;
    loadUniversities(selected);
  });
});

// Real-time secondary filtering by university name or state
filterInput.addEventListener('input', () => {
  const keyword = filterInput.value.trim().toLowerCase();
  const matches = universities.filter(uni => {
    const nameMatch = (uni.name || '').toLowerCase().includes(keyword);
    const stateMatch = (uni['state-province'] || '').toLowerCase().includes(keyword);
    return nameMatch || stateMatch;
  });
  renderDirectory(matches);
});