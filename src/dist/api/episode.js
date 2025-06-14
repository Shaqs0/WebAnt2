var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const episodeInfo = document.getElementById('episodeInfo');
const charactersContainer = document.getElementById('charactersContainer');
const episodeName = document.getElementById('episodeName');
const episodeCode = document.getElementById('episodeCode');
const episodeDate = document.getElementById('episodeDate');
function getIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}
function fetchEpisode(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://rickandmortyapi.com/api/episode/${id}`);
        if (!res.ok)
            throw new Error('Episode not found');
        return res.json();
    });
}
function fetchCharacters(urls) {
    return __awaiter(this, void 0, void 0, function* () {
        if (urls.length === 0)
            return [];
        const ids = urls.map(url => url.split('/').pop()).join(',');
        const res = yield fetch(`https://rickandmortyapi.com/api/character/${ids}`);
        const data = yield res.json();
        return Array.isArray(data) ? data : [data];
    });
}
function loadEpisodeDetails() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = getIdFromURL();
            if (!id)
                throw new Error('No episode ID provided');
            const episode = yield fetchEpisode(id);
            episodeName.textContent = episode.name;
            episodeCode.textContent = episode.episode;
            episodeDate.textContent = episode.air_date;
            const characters = yield fetchCharacters(episode.characters);
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
        }
        catch (err) {
            episodeInfo.innerHTML = `<h1>Error loading episode</h1><p>${err instanceof Error ? err.message : 'Unknown error'}</p>`;
        }
    });
}
loadEpisodeDetails();
export {};
