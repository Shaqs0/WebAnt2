interface Character {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: {
        name: string;
    };
    location: {
        name: string;
    };
    image: string;
    episode: string[];
    url: string;
    created: string;
}

interface ApiResponse {
    info: {
        count: number;
        pages: number;
        next: string | null;
        prev: string | null;
    };
    results: Character[];
}

class CharacterLoader {
    private currentPage = 1;
    private charactersPerLoad = 8;
    private isLoading = false;

    constructor() {
        this.init();
    }

    private async init(): Promise<void> {
        await this.loadCharacters();
        this.setupLoadMoreButton();
    }

    private async loadCharacters(): Promise<void> {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            const response = await axios.get<ApiResponse>(
                `https://rickandmortyapi.com/api/character?page=${this.currentPage}`
            );
            
            const characters = response.data.results.slice(0, this.charactersPerLoad);
            this.displayCharacters(characters);
            
            this.currentPage++;
            this.toggleLoadMoreButton(response.data.info.next !== null);
        } catch (error) {
            console.error('Error loading characters:', error);
        } finally {
            this.isLoading = false;
        }
    }

    private displayCharacters(characters: Character[]): void {
        const container = document.getElementById('charactersContainer');
        if (!container) return;

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

    private setupLoadMoreButton(): void {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadCharacters());
        }
    }

    private toggleLoadMoreButton(show: boolean): void {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = show ? 'block' : 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CharacterLoader();
});