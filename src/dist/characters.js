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
    var _a, _b, _c, _d;
    const name = (_a = document.getElementById("name")) === null || _a === void 0 ? void 0 : _a.value.trim();
    const species = (_b = document.getElementById("species")) === null || _b === void 0 ? void 0 : _b.value;
    const gender = (_c = document.getElementById("gender")) === null || _c === void 0 ? void 0 : _c.value;
    const status = (_d = document.getElementById("status")) === null || _d === void 0 ? void 0 : _d.value;
    const params = new URLSearchParams();
    if (name)
        params.append("name", name);
    if (species)
        params.append("species", species);
    if (gender)
        params.append("gender", gender);
    if (status)
        params.append("status", status);
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
        <div class="character-card">
            <img src="${character.image}" alt="${character.name}" class="character-image">
            <div class="character-info">
                <h2 class="character-name">${character.name}</h2>
                <p class="character-status">
                    <span class="status-indicator ${character.status.toLowerCase()}"></span>
                    ${character.status} - ${character.species}
                </p>
                <p class="character-location">Last known location: ${character.location.name}</p>
                <p class="character-origin">Origin: ${character.origin.name}</p>
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
    const inputs = [
        document.getElementById("name"),
        document.getElementById("species"),
        document.getElementById("gender"),
        document.getElementById("status")
    ];
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
document.addEventListener("DOMContentLoaded", () => {
    setupFilterInputs();
    setupLoadMoreButton();
    loadCharacters();
});
export {};
