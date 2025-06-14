var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const locationsContainer = document.getElementById('locationsContainer');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const nameInput = document.getElementById('nameFilter');
const typeFilter = document.getElementById('typeFilter');
const dimensionFilter = document.getElementById('dimensionFilter');
let allLocations = [];
let filteredLocations = [];
let renderedCount = 0;
function fetchLocations() {
    return __awaiter(this, arguments, void 0, function* (page = 1) {
        const res = yield fetch(`https://rickandmortyapi.com/api/location?page=${page}`);
        const data = yield res.json();
        return data;
    });
}
function loadInitialData() {
    return __awaiter(this, void 0, void 0, function* () {
        let nextPage = 1;
        while (nextPage) {
            const { info, results } = yield fetchLocations(nextPage);
            allLocations.push(...results);
            nextPage = info.next ? parseInt(new URL(info.next).searchParams.get('page') || '0') : null;
        }
        populateFilters();
        applyFilters();
    });
}
function populateFilters() {
    const types = new Set();
    const dimensions = new Set();
    allLocations.forEach(loc => {
        if (loc.type)
            types.add(loc.type);
        if (loc.dimension)
            dimensions.add(loc.dimension);
    });
    types.forEach(type => {
        const opt = document.createElement('option');
        opt.value = type;
        opt.textContent = type;
        typeFilter.appendChild(opt);
    });
    dimensions.forEach(dim => {
        const opt = document.createElement('option');
        opt.value = dim;
        opt.textContent = dim;
        dimensionFilter.appendChild(opt);
    });
}
function applyFilters() {
    const name = nameInput.value.toLowerCase();
    const type = typeFilter.value;
    const dimension = dimensionFilter.value;
    filteredLocations = allLocations.filter(loc => (!name || loc.name.toLowerCase().includes(name)) &&
        (!type || loc.type === type) &&
        (!dimension || loc.dimension === dimension));
    renderedCount = 0;
    locationsContainer.innerHTML = '';
    renderMore();
}
function renderMore() {
    const locationsToRender = filteredLocations.slice(renderedCount, renderedCount + 12);
    locationsToRender.forEach(loc => {
        const div = document.createElement('div');
        div.className = 'location-card';
        div.innerHTML = `
    <strong>${loc.name}</strong>
    <small>${loc.type}</small>
  `;
        div.addEventListener('click', () => {
            window.location.href = `/location.html?id=${loc.id}`;
        });
        locationsContainer.appendChild(div);
    });
    renderedCount += locationsToRender.length;
    loadMoreBtn.style.display = renderedCount >= filteredLocations.length ? 'none' : 'inline-block';
}
nameInput.addEventListener('input', applyFilters);
typeFilter.addEventListener('change', applyFilters);
dimensionFilter.addEventListener('change', applyFilters);
loadMoreBtn.addEventListener('click', renderMore);
loadInitialData();
export {};
