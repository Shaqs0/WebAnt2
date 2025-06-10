"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class CharacterLoader {
    constructor() {
        this.currentPage = 1;
        this.charactersPerLoad = 8;
        this.isLoading = false;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadCharacters();
            this.setupLoadMoreButton();
        });
    }
    loadCharacters() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isLoading)
                return;
            this.isLoading = true;
            try {
                const response = yield axios.get(`https://rickandmortyapi.com/api/character?page=${this.currentPage}`);
                const characters = response.data.results.slice(0, this.charactersPerLoad);
                this.displayCharacters(characters);
                this.currentPage++;
                this.toggleLoadMoreButton(response.data.info.next !== null);
            }
            catch (error) {
                console.error('Error loading characters:', error);
            }
            finally {
                this.isLoading = false;
            }
        });
    }
    displayCharacters(characters) {
        const container = document.getElementById('charactersContainer');
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
        `).join('');
        container.innerHTML += charactersHTML;
    }
    setupLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadCharacters());
        }
    }
    toggleLoadMoreButton(show) {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = show ? 'block' : 'none';
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new CharacterLoader();
});
