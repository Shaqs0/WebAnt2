var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchEpisode(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://rickandmortyapi.com/api/episode/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch episode');
        }
        return response.json();
    });
}
function fetchCharacter(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch character');
        }
        return response.json();
    });
}
function displayError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
}
function renderEpisodeDetails(episode) {
    const titleElement = document.getElementById('episodeTitle');
    const infoElement = document.getElementById('episodeInfo');
    if (titleElement) {
        titleElement.textContent = episode.name;
    }
    if (infoElement) {
        infoElement.textContent = `${episode.air_date} | ${episode.episode}`;
    }
}
function renderCharacters(characters) {
    const castList = document.getElementById('castList');
    if (!castList)
        return;
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
function loadEpisode() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            if (!id) {
                displayError('No episode ID found');
                return;
            }
            const episode = yield fetchEpisode(id);
            renderEpisodeDetails(episode);
            const characters = yield Promise.all(episode.characters.map(url => fetchCharacter(url)));
            renderCharacters(characters);
        }
        catch (error) {
            console.error('Error loading episode:', error);
            displayError('Failed to load episode data. Please try again later.');
        }
    });
}
document.addEventListener('DOMContentLoaded', loadEpisode);
export {};
