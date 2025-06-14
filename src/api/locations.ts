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

let allLocations: Location[] = [];
let filteredLocations: Location[] = [];
let renderedCount = 0;

async function fetchLocations(page = 1): Promise<ApiResponse> {
  const res = await fetch(`https://rickandmortyapi.com/api/location?page=${page}`);
  const data = await res.json();
  return data;
}

async function loadInitialData(): Promise<void> {
  let nextPage: number | null = 1;
  while (nextPage) {
    const { info, results } = await fetchLocations(nextPage);
    allLocations.push(...results);
    nextPage = info.next ? parseInt(new URL(info.next).searchParams.get('page') || '0') : null;
  }
  populateFilters();
  applyFilters();
}

function populateFilters(): void {
  const types = new Set<string>();
  const dimensions = new Set<string>();

  allLocations.forEach(loc => {
    if (loc.type) types.add(loc.type);
    if (loc.dimension) dimensions.add(loc.dimension);
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