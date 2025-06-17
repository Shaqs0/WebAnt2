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
    const nameInput = document.getElementById("name") as HTMLInputElement | null;
    const speciesSelect = document.getElementById("species") as HTMLSelectElement | null;
    const genderSelect = document.getElementById("gender") as HTMLSelectElement | null;
    const statusSelect = document.getElementById("status") as HTMLSelectElement | null;

    const params = new URLSearchParams();

    if (nameInput?.value.trim()) params.append("name", nameInput.value.trim());
    if (speciesSelect?.value) params.append("species", speciesSelect.value);
    if (genderSelect?.value) params.append("gender", genderSelect.value);
    if (statusSelect?.value) params.append("status", statusSelect.value);

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
    const loadMoreBtn = document.getElementById("loadMoreBtn") as HTMLButtonElement | null;
    if (loadMoreBtn) {
        loadMoreBtn.style.display = show ? "block" : "none";
    }
};

const setupFilterInputs = () => {
    const nameInput = document.getElementById("name") as HTMLInputElement | null;
    const speciesSelect = document.getElementById("species") as HTMLSelectElement | null;
    const genderSelect = document.getElementById("gender") as HTMLSelectElement | null;
    const statusSelect = document.getElementById("status") as HTMLSelectElement | null;

    const inputs = [nameInput, speciesSelect, genderSelect, statusSelect];

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
    const loadMoreBtn = document.getElementById("loadMoreBtn") as HTMLButtonElement | null;
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

const setupMobileFilters = () => {
    const mobileFiltersBtn = document.getElementById("mobileFiltersBtn") as HTMLButtonElement | null;
    const filtersModal = document.getElementById("filtersModal") as HTMLDivElement | null;
    const applyFilters = document.getElementById("applyFilters") as HTMLButtonElement | null;
    
    const modalSpecies = document.getElementById("modal-species") as HTMLSelectElement | null;
    const modalGender = document.getElementById("modal-gender") as HTMLSelectElement | null;
    const modalStatus = document.getElementById("modal-status") as HTMLSelectElement | null;
    
    const species = document.getElementById("species") as HTMLSelectElement | null;
    const gender = document.getElementById("gender") as HTMLSelectElement | null;
    const status = document.getElementById("status") as HTMLSelectElement | null;
    
    if (mobileFiltersBtn && filtersModal) {
        mobileFiltersBtn.addEventListener("click", function() {
            if (modalSpecies && species) modalSpecies.value = species.value;
            if (modalGender && gender) modalGender.value = gender.value;
            if (modalStatus && status) modalStatus.value = status.value;
            
            filtersModal.style.display = "flex";
        });
    }
    
    if (filtersModal) {
        filtersModal.addEventListener("click", function(e) {
            if (e.target === filtersModal) {
                filtersModal.style.display = "none";
            }
        });
    }
    
    if (applyFilters && filtersModal && species && gender && status) {
        applyFilters.addEventListener("click", function() {
            if (modalSpecies) species.value = modalSpecies.value;
            if (modalGender) gender.value = modalGender.value;
            if (modalStatus) status.value = modalStatus.value;
            
            const event = new Event("input");
            species.dispatchEvent(event);
            
            filtersModal.style.display = "none";
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    setupFilterInputs();
    setupLoadMoreButton();
    loadCharacters();
    setupCardClick();
    setupMobileFilters();
});