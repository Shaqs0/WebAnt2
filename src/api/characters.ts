import { Character } from "../types/character";

export interface ApiResponse {
    info: {
        count: number;
        pages: number;
        next: string | null;
        prev: string | null;
    };
    results: Character[];
}

let currentPage = 1;
const charactersPerLoad = 8;
let isLoading = false;
let hasMorePages = true;

const loader = document.getElementById("loader");

const showLoader = () => {
    if (loader) loader.classList.remove("hidden");
};

const hideLoader = () => {
    if (loader) loader.classList.add("hidden");
};


const getFilterParams = (): string => {
    const name = (document.getElementById("name") as HTMLInputElement)?.value.trim();
    const species = (document.getElementById("species") as HTMLSelectElement)?.value;
    const gender = (document.getElementById("gender") as HTMLSelectElement)?.value;
    const status = (document.getElementById("status") as HTMLSelectElement)?.value;

    const params = new URLSearchParams();

    if (name) params.append("name", name);
    if (species) params.append("species", species);
    if (gender) params.append("gender", gender);
    if (status) params.append("status", status);

    params.append("page", currentPage.toString());

    return params.toString();
};

const loadCharacters = async () => {
    if (isLoading || !hasMorePages) return;
    isLoading = true;
    showLoader(); 

    try {
        const queryParams = getFilterParams();
        const response = await axios.get<ApiResponse>(
            `https://rickandmortyapi.com/api/character?${queryParams}`
        );

        const characters = response.data.results.slice(0, charactersPerLoad);
        displayCharacters(characters);

        currentPage++;
        hasMorePages = response.data.info.next !== null;
        toggleLoadMoreButton(hasMorePages);
    } catch (error) {
        console.error("Error loading characters:", error);
        hasMorePages = false;
        toggleLoadMoreButton(false);
    } finally {
        isLoading = false;
        hideLoader(); 
    }
};


const displayCharacters = (characters: Character[]) => {
    const container = document.getElementById("charactersContainer");
    if (!container) return;
    const charactersHTML = characters.map(character => `
        <div class="character-card" data-id="${character.id}">
            <img src="${character.image}" alt="${character.name}" class="character-image">
            <div class="character-info">
                <h2 class="character-name">${character.name}</h2>
                <p class="character-species">${character.species}</p>
            </div>
        </div>
    `).join("");


    container.innerHTML += charactersHTML;
};

const resetCharacterDisplay = () => {
    const container = document.getElementById("charactersContainer");
    if (container) {
        container.innerHTML = "";
    }
};

const toggleLoadMoreButton = (show: boolean) => {
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (loadMoreBtn) {
        loadMoreBtn.style.display = show ? "block" : "none";
    }
};

const setupFilterInputs = () => {
    const inputs = [
        document.getElementById("name"),
        document.getElementById("species"),
        document.getElementById("gender"),
        document.getElementById("status")
    ];

    inputs.forEach(input => {
        if (input) {
            input.addEventListener("input", async () => {
                resetCharacterDisplay();
                currentPage = 1;
                hasMorePages = true;
                await loadCharacters();
            });
        }
    });
};

const setupLoadMoreButton = () => {
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", loadCharacters);
    }
};

const setupCardClick = () => {
    const container = document.getElementById("charactersContainer");

    container?.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const card = target.closest(".character-card") as HTMLElement | null;

        if (card && card.dataset.id) {
            const characterId = card.dataset.id;
            window.location.href = `character.html?id=${characterId}`;
        }
    });
};


document.addEventListener("DOMContentLoaded", () => {
    setupFilterInputs();
    setupLoadMoreButton();
    loadCharacters();
    setupCardClick();
});
