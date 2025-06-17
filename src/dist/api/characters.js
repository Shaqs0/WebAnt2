var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let currentPage = 1;
const charactersPerLoad = 8;
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
const getFilterParams = () => {
    const nameInput = document.getElementById("name");
    const speciesSelect = document.getElementById("species");
    const genderSelect = document.getElementById("gender");
    const statusSelect = document.getElementById("status");
    const params = new URLSearchParams();
    if (nameInput === null || nameInput === void 0 ? void 0 : nameInput.value.trim())
        params.append("name", nameInput.value.trim());
    if (speciesSelect === null || speciesSelect === void 0 ? void 0 : speciesSelect.value)
        params.append("species", speciesSelect.value);
    if (genderSelect === null || genderSelect === void 0 ? void 0 : genderSelect.value)
        params.append("gender", genderSelect.value);
    if (statusSelect === null || statusSelect === void 0 ? void 0 : statusSelect.value)
        params.append("status", statusSelect.value);
    params.append("page", currentPage.toString());
    return params.toString();
};
const loadCharacters = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isLoading || !hasMorePages)
        return;
    isLoading = true;
    showLoader();
    try {
        const queryParams = getFilterParams();
        const response = yield axios.get(`https://rickandmortyapi.com/api/character?${queryParams}`);
        const characters = response.data.results.slice(0, charactersPerLoad);
        displayCharacters(characters);
        currentPage++;
        hasMorePages = response.data.info.next !== null;
        toggleLoadMoreButton(hasMorePages);
    }
    catch (error) {
        console.error("Error loading characters:", error);
        hasMorePages = false;
        toggleLoadMoreButton(false);
    }
    finally {
        isLoading = false;
        hideLoader();
    }
});
const displayCharacters = (characters) => {
    const container = document.getElementById("charactersContainer");
    if (!container)
        return;
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
const toggleLoadMoreButton = (show) => {
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (loadMoreBtn) {
        loadMoreBtn.style.display = show ? "block" : "none";
    }
};
const setupFilterInputs = () => {
    const nameInput = document.getElementById("name");
    const speciesSelect = document.getElementById("species");
    const genderSelect = document.getElementById("gender");
    const statusSelect = document.getElementById("status");
    const inputs = [nameInput, speciesSelect, genderSelect, statusSelect];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener("input", () => __awaiter(void 0, void 0, void 0, function* () {
                resetCharacterDisplay();
                currentPage = 1;
                hasMorePages = true;
                yield loadCharacters();
            }));
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
    container === null || container === void 0 ? void 0 : container.addEventListener("click", (e) => {
        const target = e.target;
        const card = target.closest(".character-card");
        if (card && card.dataset.id) {
            const characterId = card.dataset.id;
            window.location.href = `character.html?id=${characterId}`;
        }
    });
};
const setupMobileFilters = () => {
    const mobileFiltersBtn = document.getElementById("mobileFiltersBtn");
    const filtersModal = document.getElementById("filtersModal");
    const applyFilters = document.getElementById("applyFilters");
    // Modal select elements
    const modalSpecies = document.getElementById("modal-species");
    const modalGender = document.getElementById("modal-gender");
    const modalStatus = document.getElementById("modal-status");
    // Original select elements
    const species = document.getElementById("species");
    const gender = document.getElementById("gender");
    const status = document.getElementById("status");
    if (mobileFiltersBtn && filtersModal) {
        mobileFiltersBtn.addEventListener("click", function () {
            // Sync current values to modal selects
            if (modalSpecies && species)
                modalSpecies.value = species.value;
            if (modalGender && gender)
                modalGender.value = gender.value;
            if (modalStatus && status)
                modalStatus.value = status.value;
            filtersModal.style.display = "flex";
        });
    }
    if (filtersModal) {
        filtersModal.addEventListener("click", function (e) {
            if (e.target === filtersModal) {
                filtersModal.style.display = "none";
            }
        });
    }
    if (applyFilters && filtersModal && species && gender && status) {
        applyFilters.addEventListener("click", function () {
            // Apply selected values to original selects
            if (modalSpecies)
                species.value = modalSpecies.value;
            if (modalGender)
                gender.value = modalGender.value;
            if (modalStatus)
                status.value = modalStatus.value;
            // Trigger filter change
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
export {};
