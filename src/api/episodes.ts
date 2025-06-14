import { Episode } from "../types/episode";

interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Episode[];
}

class EpisodeLoader {
  private nextPage: string | null = 'https://rickandmortyapi.com/api/episode';
  private readonly episodesContainer: HTMLElement;
  private readonly loadMoreButton: HTMLButtonElement;
  private readonly searchInput: HTMLInputElement;

  constructor() {
    this.episodesContainer = document.getElementById('episodes') as HTMLElement;
    this.loadMoreButton = document.getElementById('loadMore') as HTMLButtonElement;
    this.searchInput = document.getElementById('search') as HTMLInputElement;

    this.init();
  }

  private init(): void {
    this.loadInitialEpisodes();
    this.setupEventListeners();
    this.loadMoreButton.classList.add('load-more-btn'); 
  }

  private setupEventListeners(): void {
    this.loadMoreButton.addEventListener('click', () => this.handleLoadMore());
    this.searchInput.addEventListener('input', () => this.handleSearch());
  }

  private async loadInitialEpisodes(): Promise<void> {
    if (this.nextPage) {
      await this.fetchEpisodes(this.nextPage);
    }
  }

  private async fetchEpisodes(url: string): Promise<void> {
    try {
      this.setLoadingState(true);

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch episodes');

      const data: ApiResponse = await response.json();
      this.nextPage = data.info.next;
      this.renderEpisodes(data.results);

    } catch (error) {
      console.error('Error fetching episodes:', error);
      this.showError('Failed to load episodes. Please try again.');
    } finally {
      this.setLoadingState(false);
      this.updateLoadMoreButton();
    }
  }

  private setLoadingState(isLoading: boolean): void {
    this.loadMoreButton.disabled = isLoading;
    if (isLoading) {
      this.loadMoreButton.classList.add('loading');
    } else {
      this.loadMoreButton.classList.remove('loading');
      this.loadMoreButton.textContent = 'LOAD MORE';
    }
  }

  private renderEpisodes(episodes: Episode[]): void {
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

  private async handleLoadMore(): Promise<void> {
    if (this.nextPage) {
      await this.fetchEpisodes(this.nextPage);
    }
  }

  private async handleSearch(): Promise<void> {
    const query = this.searchInput.value.trim();
    this.episodesContainer.innerHTML = '';
    this.nextPage = null;

    if (!query) {
      this.nextPage = 'https://rickandmortyapi.com/api/episode';
      await this.fetchEpisodes(this.nextPage);
      return;
    }

    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/episode?name=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) throw new Error('Search failed');
      const data: ApiResponse = await response.json();
      
      this.renderEpisodes(data.results);
      if (data.results.length === 0) {
        this.showNoResults();
      }
    } catch (error) {
      console.error('Search error:', error);
      this.showNoResults();
    }
  }

  private updateLoadMoreButton(): void {
    this.loadMoreButton.style.display = this.nextPage ? 'flex' : 'none';
  }

  private showNoResults(): void {
    const message = document.createElement('p');
    message.className = 'episodes--no-results';
    message.textContent = 'No episodes found matching your search.';
    this.episodesContainer.appendChild(message);
  }

  private showError(message: string): void {
    const errorElement = document.createElement('p');
    errorElement.className = 'episodes--no-results';
    errorElement.textContent = message;
    this.episodesContainer.appendChild(errorElement);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new EpisodeLoader();
});