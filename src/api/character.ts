import { Character } from "../types/character";
import { Episode } from "../types/episode";


let isLoading = false;
let hasMorePages = true;
const loader = document.getElementById("loader");

const showLoader = () => {
    if (loader) loader.classList.remove("hidden");
};

const hideLoader = () => {
    if (loader) loader.classList.add("hidden");
};

const getCharacterIdFromURL = (): string | null => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
};

const loadCharacter = async (id: string) => {
    if (isLoading || !hasMorePages) return;
    isLoading = true;
    showLoader(); 

    try {
        const characterRes = await axios.get<Character>(`https://rickandmortyapi.com/api/character/${id}`);
        const character = characterRes.data;

        const episodeRequests = character.episode.map(url => axios.get<Episode>(url));
        const episodeResponses = await Promise.all(episodeRequests);
        const episodes = episodeResponses.map(res => res.data);

        renderCharacter(character, episodes);
    } catch (error) {
        console.error("Ошибка загрузки персонажа:", error);
        const container = document.getElementById("characterDetails");
        if (container) {
            container.innerHTML = `<p>Не удалось загрузить информацию о персонаже.</p>`;
        }
    } finally {
        isLoading = false;
        hideLoader(); 
    }
};


const renderCharacter = (character: Character, episodes: Episode[]) => {
    const container = document.getElementById("characterDetails");
    if (!container) return;

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
    if (id) loadCharacter(id);
});
