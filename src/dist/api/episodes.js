var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let nextPage = 'https://rickandmortyapi.com/api/episode';
const episodesContainer = document.getElementById('episodes');
const loadMoreButton = document.getElementById('loadMore');
const searchInput = document.getElementById('search');
document.addEventListener('DOMContentLoaded', () => {
    loadInitialEpisodes();
    setupEventListeners();
});
function setupEventListeners() {
    loadMoreButton.addEventListener('click', handleLoadMore);
    searchInput.addEventListener('input', handleSearch);
}
function loadInitialEpisodes() {
    return __awaiter(this, void 0, void 0, function* () {
        if (nextPage) {
            yield fetchEpisodes(nextPage);
        }
    });
}
function fetchEpisodes(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            loadMoreButton.disabled = true;
            loadMoreButton.textContent = 'Loading...';
            const response = yield fetch(url);
            if (!response.ok)
                throw new Error('Failed to fetch episodes');
            const data = yield response.json();
            nextPage = data.info.next;
            renderEpisodes(data.results);
        }
        catch (error) {
            console.error('Error fetching episodes:', error);
            showError('Failed to load episodes. Please try again.');
        }
        finally {
            loadMoreButton.disabled = false;
            loadMoreButton.textContent = 'LOAD MORE';
            updateLoadMoreButton();
        }
    });
}
function renderEpisodes(episodes) {
    episodes.forEach((episode) => {
        const card = document.createElement('div');
        card.className = 'episodes--card';
        card.innerHTML = `
      <strong>${episode.name}</strong>
      <br>${episode.air_date}
      <br><em>${episode.episode}</em>
    `;
        card.addEventListener('click', () => {
            window.location.href = `episode.html?id=${episode.id}`;
        });
        episodesContainer.appendChild(card);
    });
}
function handleLoadMore() {
    return __awaiter(this, void 0, void 0, function* () {
        if (nextPage) {
            yield fetchEpisodes(nextPage);
        }
    });
}
function handleSearch() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = searchInput.value.trim();
        episodesContainer.innerHTML = '';
        nextPage = null;
        if (!query) {
            nextPage = 'https://rickandmortyapi.com/api/episode';
            yield fetchEpisodes(nextPage);
            return;
        }
        try {
            const response = yield fetch(`https://rickandmortyapi.com/api/episode?name=${encodeURIComponent(query)}`);
            if (!response.ok)
                throw new Error('Search failed');
            const data = yield response.json();
            renderEpisodes(data.results);
            if (data.results.length === 0) {
                showNoResults();
            }
        }
        catch (error) {
            console.error('Search error:', error);
            showNoResults();
        }
    });
}
function updateLoadMoreButton() {
    loadMoreButton.style.display = nextPage ? 'inline-block' : 'none';
    loadMoreButton.className = 'episodes--load-more';
}
function showNoResults() {
    const message = document.createElement('p');
    message.className = 'episodes--no-results';
    message.textContent = 'No episodes found matching your search.';
    episodesContainer.appendChild(message);
}
function showError(message) {
    const errorElement = document.createElement('p');
    errorElement.className = 'episodes--no-results';
    errorElement.textContent = message;
    episodesContainer.appendChild(errorElement);
}
export {};
