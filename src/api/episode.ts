import { Character } from "../types/character";
import { Episode } from "../types/episode";

async function fetchEpisode(id: string): Promise<Episode> {
  const response = await fetch(`https://rickandmortyapi.com/api/episode/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch episode');
  }
  return response.json();
}

async function fetchCharacter(url: string): Promise<Character> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch character');
  }
  return response.json();
}

function displayError(message: string): void {
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  document.body.appendChild(errorElement);
}

function renderEpisodeDetails(episode: Episode): void {
  const titleElement = document.getElementById('episodeTitle');
  const infoElement = document.getElementById('episodeInfo');

  if (titleElement) {
    titleElement.textContent = episode.name;
  }

  if (infoElement) {
    infoElement.textContent = `${episode.air_date} | ${episode.episode}`;
  }
}

function renderCharacters(characters: Character[]): void  {
  const castList = document.getElementById('castList');
  if (!castList) return;

  characters.forEach(character => {
    const div = document.createElement('div');
    div.className = 'episode--cast-member';
    div.innerHTML = `
      <img src="${character.image}" alt="${character.name}">
      <div><strong>${character.name}</strong></div>
      <small>${character.species}</small>
    `;
    div.addEventListener('click', () => {
      window.location.href = `character.html?id=${character.id}`;
    });
    castList.appendChild(div);
  });
}


async function loadEpisode(): Promise<void> {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
      displayError('No episode ID found');
      return;
    }

    const episode = await fetchEpisode(id);
    renderEpisodeDetails(episode);

    const characters = await Promise.all(
      episode.characters.map(url => fetchCharacter(url))
    );
    renderCharacters(characters);
  } catch (error) {
    console.error('Error loading episode:', error);
    displayError('Failed to load episode data. Please try again later.');
  }
}

document.addEventListener('DOMContentLoaded', loadEpisode);