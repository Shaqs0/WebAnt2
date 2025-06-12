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

  const hasManyEpisodes = episodes.length > 6;
  
  container.innerHTML = `
    <div class="character-detail">
      <a class="go-back" href="index.html">← GO BACK</a>
      <div class="character-header">
        <img src="${character.image}" alt="${character.name}" class="character-avatar" />
        <h1 class="character-name">${character.name}</h1>
      </div>

      <div class="character-info-sections">
        <section class="character-info-details">
          <h2>Informations</h2>
          <ul class='list_character-details'>
            <li class="character-details_info"><strong>Gender</strong> ${character.gender}</li>
            <li class="character-details_info"><strong>Status</strong> ${character.status}</li>
            <li class="character-details_info"><strong>Species</strong> ${character.species}</li>
            <li class="character-details_info"><strong>Origin</strong> ${character.origin.name}</li>
            <li class="character-details_info"><strong>Type</strong> ${character.type || "Unknown"}</li>
            <li class="character-details_info location-item">
              <div class="location-content">
                <strong>Location</strong>
                ${character.location.url
                  ? `<a href="location.html?id=${character.location.url.split("/").pop()}" class='character_details-location'>
                      <span>${character.location.name}</span>
                      <img src="src/images/icons/chevron_right_24px.svg" alt="" class="location-arrow">
                    </a>`
                  : character.location.name}
              </div>
            </li>
          </ul>
        </section>
        <section class="character-episodes ${hasManyEpisodes ? 'many-episodes' : ''}">
          <h2>Episodes</h2>
          <div class="episodes-container">
            <ul class='list_character-episodes-details'>
              ${episodes.map(ep => `
                <li class="episode-item">
                  <a href="episode.html?id=${ep.id}" class="episode-link">
                    <div class="episode-content">
                      <strong>${ep.episode}</strong>
                      <div>${ep.name}</div>
                      <small>${new Date(ep.air_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</small>
                    </div>
                    <img src="src/images/icons/chevron_right_24px.svg" alt="" class="episode-arrow">
                  </a>
                </li>
              `).join("")}
            </ul>
          </div>
        </section>
      </div>
    </div>
  `;
};

 
document.addEventListener("DOMContentLoaded", () => {
    const id = getCharacterIdFromURL();
    if (id) loadCharacter(id);
});
