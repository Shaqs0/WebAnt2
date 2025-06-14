var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const locationInfo = document.getElementById('locationInfo');
const residentsContainer = document.getElementById('residentsContainer');
const backButtonContainer = document.querySelector('.location-details__back');
function getIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}
function fetchLocation(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://rickandmortyapi.com/api/location/${id}`);
        if (!res.ok)
            throw new Error('Location not found');
        return res.json();
    });
}
function fetchResidents(urls) {
    return __awaiter(this, void 0, void 0, function* () {
        if (urls.length === 0)
            return [];
        const ids = urls.map(url => url.split('/').pop()).join(',');
        const res = yield fetch(`https://rickandmortyapi.com/api/character/${ids}`);
        const data = yield res.json();
        return Array.isArray(data) ? data : [data];
    });
}
function loadLocationDetails() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = getIdFromURL();
            if (!id)
                throw new Error('No location ID provided');
            const location = yield fetchLocation(id);
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
            const residents = yield fetchResidents(location.residents);
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
        }
        catch (err) {
            locationInfo.innerHTML = `<h1>Error loading location</h1><p>${err instanceof Error ? err.message : 'Unknown error'}</p>`;
        }
    });
}
loadLocationDetails();
export {};
