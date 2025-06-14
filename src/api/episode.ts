import { Character } from "../types/character";
import { Episode } from "../types/episode";

const episodeInfo = document.getElementById('episodeInfo') as HTMLElement;
const charactersContainer = document.getElementById('charactersContainer') as HTMLElement;
const episodeName = document.getElementById('episodeName') as HTMLElement;
const episodeCode = document.getElementById('episodeCode') as HTMLElement;
const episodeDate = document.getElementById('episodeDate') as HTMLElement;

function getIdFromURL(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function fetchEpisode(id: string): Promise<Episode> {
    const res = await fetch(`https://rickandmortyapi.com/api/episode/${id}`);
    if (!res.ok) throw new Error('Episode not found');
    return res.json();
}

async function fetchCharacters(urls: string[]): Promise<Character[]> {
    if (urls.length === 0) return [];

    const ids = urls.map(url => url.split('/').pop()).join(',');
    const res = await fetch(`https://rickandmortyapi.com/api/character/${ids}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [data];
}

async function loadEpisodeDetails(): Promise<void> {
    try {
        const id = getIdFromURL();
        if (!id) throw new Error('No episode ID provided');

        const episode = await fetchEpisode(id);

        episodeName.textContent = episode.name;
        episodeCode.textContent = episode.episode;
        episodeDate.textContent = episode.air_date;

        const characters = await fetchCharacters(episode.characters);

        if (characters.length === 0) {
            charactersContainer.innerHTML = '<p>No characters found in this episode.</p>';
            return;
        }

        characters.forEach(character => {
            const div = document.createElement('div');
            div.className = 'character-card';
            div.innerHTML = `
                <img src="${character.image}" alt="${character.name}" />
                <div class="character-info">
                    <h3>${character.name}</h3>
                    <p>${character.species}</p>
                </div>
            `;
            div.addEventListener('click', () => {
                window.location.href = `character.html?id=${character.id}`;
            });
            charactersContainer.appendChild(div);
        });

    } catch (err) {
        episodeInfo.innerHTML = `<h1>Error loading episode</h1><p>${err instanceof Error ? err.message : 'Unknown error'}</p>`;
    }
}

loadEpisodeDetails();