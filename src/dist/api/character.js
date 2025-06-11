var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let isLoading = false;
let hasMorePages = true;
const loader = document.getElementById("loader");
const showLoader = () => {
    if (loader)
        loader.classList.remove("hidden");
};
const hideLoader = () => {
    if (loader)
        loader.classList.add("hidden");
};
const getCharacterIdFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
};
const loadCharacter = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (isLoading || !hasMorePages)
        return;
    isLoading = true;
    showLoader();
    try {
        const characterRes = yield axios.get(`https://rickandmortyapi.com/api/character/${id}`);
        const character = characterRes.data;
        const episodeRequests = character.episode.map(url => axios.get(url));
        const episodeResponses = yield Promise.all(episodeRequests);
        const episodes = episodeResponses.map(res => res.data);
        renderCharacter(character, episodes);
    }
    catch (error) {
        console.error("Ошибка загрузки персонажа:", error);
        const container = document.getElementById("characterDetails");
        if (container) {
            container.innerHTML = `<p>Не удалось загрузить информацию о персонаже.</p>`;
        }
    }
    finally {
        isLoading = false;
        hideLoader();
    }
});
const renderCharacter = (character, episodes) => {
    const container = document.getElementById("characterDetails");
    if (!container)
        return;
    container.innerHTML = `
        <div class="character-profile">
            <img src="${character.image}" alt="${character.name}" class="character-detail-image" />
            <h1>${character.name}</h1>
            <p><strong>Status:</strong> ${character.status}</p>
            <p><strong>Species:</strong> ${character.species}</p>
            <p><strong>Gender:</strong> ${character.gender}</p>
            <p><strong>Origin:</strong> ${character.origin.name}</p>
            <p><strong>Location:</strong> ${character.location.name}</p>
            <h2>Episodes:</h2>
            <ul>
              
                ${episodes.map(ep => `
                    <li>
                        <a href="episode.html?id=${ep.id}">
                            ${ep.episode} - ${ep.name}
                        </a>
                    </li>`).join("")}
        

            </ul>
        </div>
    `;
};
document.addEventListener("DOMContentLoaded", () => {
    const id = getCharacterIdFromURL();
    if (id)
        loadCharacter(id);
});
export {};
