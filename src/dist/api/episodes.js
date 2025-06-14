var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class EpisodeLoader {
    constructor() {
        this.nextPage = 'https://rickandmortyapi.com/api/episode';
        this.episodesContainer = document.getElementById('episodes');
        this.loadMoreButton = document.getElementById('loadMore');
        this.searchInput = document.getElementById('search');
        this.init();
    }
    init() {
        this.loadInitialEpisodes();
        this.setupEventListeners();
        this.loadMoreButton.classList.add('load-more-btn');
    }
    setupEventListeners() {
        this.loadMoreButton.addEventListener('click', () => this.handleLoadMore());
        this.searchInput.addEventListener('input', () => this.handleSearch());
    }
    loadInitialEpisodes() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.nextPage) {
                yield this.fetchEpisodes(this.nextPage);
            }
        });
    }
    fetchEpisodes(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setLoadingState(true);
                const response = yield fetch(url);
                if (!response.ok)
                    throw new Error('Failed to fetch episodes');
                const data = yield response.json();
                this.nextPage = data.info.next;
                this.renderEpisodes(data.results);
            }
            catch (error) {
                console.error('Error fetching episodes:', error);
                this.showError('Failed to load episodes. Please try again.');
            }
            finally {
                this.setLoadingState(false);
                this.updateLoadMoreButton();
            }
        });
    }
    setLoadingState(isLoading) {
        this.loadMoreButton.disabled = isLoading;
        if (isLoading) {
            this.loadMoreButton.classList.add('loading');
        }
        else {
            this.loadMoreButton.classList.remove('loading');
            this.loadMoreButton.textContent = 'LOAD MORE';
        }
    }
    renderEpisodes(episodes) {
        episodes.forEach(episode => {
            const card = document.createElement('div');
            card.className = 'episodes-card';
            card.innerHTML = `
        <strong>${episode.name}</strong>
        <br><p>${episode.air_date}</p>
        <br><em>${episode.episode}</em>
      `;
            card.addEventListener('click', () => {
                window.location.href = `episode.html?id=${episode.id}`;
            });
            this.episodesContainer.appendChild(card);
        });
    }
    handleLoadMore() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.nextPage) {
                yield this.fetchEpisodes(this.nextPage);
            }
        });
    }
    handleSearch() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.searchInput.value.trim();
            this.episodesContainer.innerHTML = '';
            this.nextPage = null;
            if (!query) {
                this.nextPage = 'https://rickandmortyapi.com/api/episode';
                yield this.fetchEpisodes(this.nextPage);
                return;
            }
            try {
                const response = yield fetch(`https://rickandmortyapi.com/api/episode?name=${encodeURIComponent(query)}`);
                if (!response.ok)
                    throw new Error('Search failed');
                const data = yield response.json();
                this.renderEpisodes(data.results);
                if (data.results.length === 0) {
                    this.showNoResults();
                }
            }
            catch (error) {
                console.error('Search error:', error);
                this.showNoResults();
            }
        });
    }
    updateLoadMoreButton() {
        this.loadMoreButton.style.display = this.nextPage ? 'flex' : 'none';
    }
    showNoResults() {
        const message = document.createElement('p');
        message.className = 'episodes--no-results';
        message.textContent = 'No episodes found matching your search.';
        this.episodesContainer.appendChild(message);
    }
    showError(message) {
        const errorElement = document.createElement('p');
        errorElement.className = 'episodes--no-results';
        errorElement.textContent = message;
        this.episodesContainer.appendChild(errorElement);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new EpisodeLoader();
});
export {};
