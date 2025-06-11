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

let nextPage: string | null = 'https://rickandmortyapi.com/api/episode';
const episodesContainer = document.getElementById('episodes') as HTMLElement;
const loadMoreButton = document.getElementById('loadMore') as HTMLButtonElement;
const searchInput = document.getElementById('search') as HTMLInputElement;

document.addEventListener('DOMContentLoaded', () => {
  loadInitialEpisodes();
  setupEventListeners();
});

function setupEventListeners(): void {
  loadMoreButton.addEventListener('click', handleLoadMore);
  searchInput.addEventListener('input', handleSearch);
}

async function loadInitialEpisodes(): Promise<void> {
  if (nextPage) {
    await fetchEpisodes(nextPage);
  }
}

async function fetchEpisodes(url: string): Promise<void> {
  try {
    loadMoreButton.disabled = true;
    loadMoreButton.textContent = 'Loading...';

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch episodes');

    const data: ApiResponse = await response.json();
    nextPage = data.info.next;
    renderEpisodes(data.results);

  } catch (error) {
    console.error('Error fetching episodes:', error);
    showError('Failed to load episodes. Please try again.');
  } finally {
    loadMoreButton.disabled = false;
    loadMoreButton.textContent = 'LOAD MORE';
    updateLoadMoreButton();
  }
}

function renderEpisodes(episodes: Episode[]): void {
  episodes.forEach((episode: Episode) => {
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

async function handleLoadMore(): Promise<void> {
  if (nextPage) {
    await fetchEpisodes(nextPage);
  }
}

async function handleSearch(): Promise<void> {
  const query = searchInput.value.trim();
  episodesContainer.innerHTML = '';
  nextPage = null;

  if (!query) {
    nextPage = 'https://rickandmortyapi.com/api/episode';
    await fetchEpisodes(nextPage);
    return;
  }

  try {
    const response = await fetch(`https://rickandmortyapi.com/api/episode?name=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');

    const data: ApiResponse = await response.json();
    renderEpisodes(data.results);

    if (data.results.length === 0) {
      showNoResults();
    }
  } catch (error) {
    console.error('Search error:', error);
    showNoResults();
  }
}

function updateLoadMoreButton(): void {
  loadMoreButton.style.display = nextPage ? 'inline-block' : 'none';
  loadMoreButton.className = 'episodes--load-more';
}

function showNoResults(): void {
  const message = document.createElement('p');
  message.className = 'episodes--no-results';
  message.textContent = 'No episodes found matching your search.';
  episodesContainer.appendChild(message);
}

function showError(message: string): void {
  const errorElement = document.createElement('p');
  errorElement.className = 'episodes--no-results';
  errorElement.textContent = message;
  episodesContainer.appendChild(errorElement);
}
