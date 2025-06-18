import { Location } from "../types/locations";

interface ApiResponse {
  info: {
    next: string | null;
  };
  results: Location[];
}

const locationsContainer = document.getElementById('locationsContainer') as HTMLElement;
const loadMoreBtn = document.getElementById('loadMoreBtn') as HTMLButtonElement;
const nameInput = document.getElementById('nameFilter') as HTMLInputElement;
const typeFilter = document.getElementById('typeFilter') as HTMLSelectElement;
const dimensionFilter = document.getElementById('dimensionFilter') as HTMLSelectElement;

const mobileFiltersBtn = document.getElementById('mobileFiltersBtn') as HTMLButtonElement;
const filtersModal = document.getElementById('filtersModal') as HTMLElement;
const applyFiltersBtn = document.getElementById('applyFilters') as HTMLButtonElement;
const modalTypeFilter = document.getElementById('modal-type') as HTMLSelectElement;
const modalDimensionFilter = document.getElementById('modal-dimension') as HTMLSelectElement;

let allLocations: Location[] = [];
let filteredLocations: Location[] = [];
let renderedCount = 0;

async function fetchLocations(page = 1): Promise<ApiResponse> {
  const res = await fetch(`https://rickandmortyapi.com/api/location?page=${page}`);
  const data = await res.json();
  return data;
}

async function loadInitialData(): Promise<void> {
  try {
    let nextPage: number | null = 1;
    while (nextPage) {
      const { info, results } = await fetchLocations(nextPage);
      allLocations.push(...results);
      nextPage = info.next ? parseInt(new URL(info.next).searchParams.get('page') || '0') : null;
    }
    populateFilters();
    applyFilters();
  } catch (error) {
    console.error('Error loading locations:', error);
    locationsContainer.innerHTML = '<p>Error loading locations. Please try again later.</p>';
  }
}

function populateFilters(): void {
  const types = new Set<string>();
  const dimensions = new Set<string>();

  allLocations.forEach(loc => {
    if (loc.type) types.add(loc.type);
    if (loc.dimension) dimensions.add(loc.dimension);
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

function applyFilters(): void {
  const name = nameInput.value.toLowerCase();
  const type = typeFilter.value;
  const dimension = dimensionFilter.value;

  filteredLocations = allLocations.filter(loc =>
    (!name || loc.name.toLowerCase().includes(name)) &&
    (!type || loc.type === type) &&
    (!dimension || loc.dimension === dimension)
  );

  renderedCount = 0;
  locationsContainer.innerHTML = '';
  renderMore();
}

function renderMore(): void {
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
function setupEventListeners(): void {
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

  const closeModalBtn = document.getElementById('closeModalBtn') as HTMLImageElement;
  closeModalBtn.addEventListener('click', () => {
    filtersModal.style.display = 'none';
  });
}


document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadInitialData();
});