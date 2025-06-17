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
const mobileFiltersBtn = document.getElementById('mobileFiltersBtn');
const filtersModal = document.getElementById('filtersModal');
const applyFiltersBtn = document.getElementById('applyFilters');
const modalTypeFilter = document.getElementById('modal-type');
const modalDimensionFilter = document.getElementById('modal-dimension');
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
        try {
            let nextPage = 1;
            while (nextPage) {
                const { info, results } = yield fetchLocations(nextPage);
                allLocations.push(...results);
                nextPage = info.next ? parseInt(new URL(info.next).searchParams.get('page') || '0') : null;
            }
            populateFilters();
            applyFilters();
        }
        catch (error) {
            console.error('Error loading locations:', error);
            locationsContainer.innerHTML = '<p>Error loading locations. Please try again later.</p>';
        }
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
    typeFilter.innerHTML = '<option value="">Type</option>';
    dimensionFilter.innerHTML = '<option value="">Dimension</option>';
    modalTypeFilter.innerHTML = '<option value="">All Types</option>';
    modalDimensionFilter.innerHTML = '<option value="">All Dimensions</option>';
    types.forEach(type => {
        const opt = document.createElement('option');
        opt.value = type;
        opt.textContent = type;
        typeFilter.appendChild(opt.cloneNode(true));
        modalTypeFilter.appendChild(opt);
    });
    dimensions.forEach(dim => {
        const opt = document.createElement('option');
        opt.value = dim;
        opt.textContent = dim;
        dimensionFilter.appendChild(opt.cloneNode(true));
        modalDimensionFilter.appendChild(opt);
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
    if (locationsToRender.length === 0 && renderedCount === 0) {
        locationsContainer.innerHTML = '<p>No locations found matching your criteria.</p>';
        loadMoreBtn.style.display = 'none';
        return;
    }
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
function setupEventListeners() {
    nameInput.addEventListener('input', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    dimensionFilter.addEventListener('change', applyFilters);
    loadMoreBtn.addEventListener('click', renderMore);
    mobileFiltersBtn.addEventListener('click', () => {
        modalTypeFilter.value = typeFilter.value;
        modalDimensionFilter.value = dimensionFilter.value;
        filtersModal.style.display = 'flex';
    });
    applyFiltersBtn.addEventListener('click', () => {
        typeFilter.value = modalTypeFilter.value;
        dimensionFilter.value = modalDimensionFilter.value;
        filtersModal.style.display = 'none';
        applyFilters();
    });
    filtersModal.addEventListener('click', (e) => {
        if (e.target === filtersModal) {
            filtersModal.style.display = 'none';
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadInitialData();
});
export {};
