import { Location } from "../types/locations";

const locationInfo = document.getElementById('locationInfo') as HTMLElement;
const residentsContainer = document.getElementById('residentsContainer') as HTMLElement;
const backButtonContainer = document.querySelector('.location-details__back') as HTMLElement;

interface Character {
    id: number;
    name: string;
    species: string;
    image: string;
}

function getIdFromURL(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function fetchLocation(id: string): Promise<Location> {
    const res = await fetch(`https://rickandmortyapi.com/api/location/${id}`);
    if (!res.ok) throw new Error('Location not found');
    return res.json();
}

async function fetchResidents(urls: string[]): Promise<Character[]> {
    if (urls.length === 0) return [];

    const ids = urls.map(url => url.split('/').pop()).join(',');
    const res = await fetch(`https://rickandmortyapi.com/api/character/${ids}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [data];
}

async function loadLocationDetails(): Promise<void> {
    try {
        const id = getIdFromURL();
        if (!id) throw new Error('No location ID provided');

        const location = await fetchLocation(id);

       locationInfo.innerHTML = `
            <div class="location-header">
                <a href="locations.html" class="location-details__go-back">
                    <span class="go-back-content">
                        <img src="src/images/icons/arrow_back_24px.svg" alt="Back" class="back-arrow"/>
                        GO BACK
                    </span>
                </a>
                <h1 class="location-name">${location.name}</h1>
            </div>
            <div class='location-info'>
                <p class="location-type"><strong>Type</strong> ${location.type}</p>
                <p class="location-dimension"><strong>Dimension</strong> ${location.dimension}</p>
            </div>
        `;

        const residents = await fetchResidents(location.residents);

        if (residents.length === 0) {
            residentsContainer.innerHTML = '<p>No residents found.</p>';
            return;
        }

        residents.forEach(resident => {
            const div = document.createElement('div');
            div.className = 'resident-card';
            div.innerHTML = `
                <img src="${resident.image}" alt="${resident.name}" />
                <div class="resident-info">
                    <h3>${resident.name}</h3>
                    <p>${resident.species}</p>
                </div>
            `;
            div.addEventListener('click', () => {
                window.location.href = `character.html?id=${resident.id}`;
            });
            residentsContainer.appendChild(div);
        });

    } catch (err) {
        locationInfo.innerHTML = `<h1>Error loading location</h1><p>${err instanceof Error ? err.message : 'Unknown error'}</p>`;
    }
}

loadLocationDetails();