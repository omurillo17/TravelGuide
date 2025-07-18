/* ---------  SELECTORES  (deben existir en tu HTML)  --------- */
const searchBtn   = document.querySelector('.btn-search');
const resetBtn    = document.querySelector('.btn-clear');
const searchInput = document.querySelector('input[type="search"]');
const resultsDiv  = document.getElementById('results');

/* ---------  CARGAR Y APLANAR DATOS  --------- */
let places = [];

fetch('data/travel_recommendation_api.json')
  .then(r => r.json())
  .then(json => {
    /* beaches */
    json.beaches.forEach(b =>
      places.push({ ...b, keyword:'beach', category:'beach' })
    );

    /* temples */
    json.temples.forEach(t =>
      places.push({ ...t, keyword:'temple', category:'temple' })
    );

    /* countries / cities */
    json.countries.forEach(c =>
      c.cities.forEach(city =>
        places.push({
          ...city,
          country:c.name,
          keyword:c.name.toLowerCase(),  // australia, japan…
          category:'country'
        })
      )
    );

    console.log('Datos cargados:', places);   // ← debe mostrar elementos

    /* Ahora que los datos existen, añadimos los listeners */
    searchBtn.addEventListener('click', e => {
      e.preventDefault();
      renderResults(searchInput.value.trim());
    });

    resetBtn.addEventListener('click', () => {
      resultsDiv.innerHTML = '';
      searchInput.value = '';
    });
  })
  .catch(err => console.error('Error al cargar JSON', err));

/* ---------  RENDERIZAR RESULTADOS  --------- */
function renderResults(term){
  if(!term){
    alert('Ingresa un término de búsqueda');
    return;
  }

  const base  = term.replace(/s$/,'').toLowerCase();
  const regex = new RegExp(base,'i');

  const matches = places.filter(p =>
      regex.test(p.keyword) || regex.test(p.name) || regex.test(p.country||'')
  );

  resultsDiv.innerHTML = matches.length
    ? matches.map(cardHTML).join('')
    : '<p>No se encontraron destinos.</p>';
}

function cardHTML(p){
  return `
    <article class="card">
      <img src="${p.imageUrl}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <a href="#" class="btn-primary btn-small">Visit</a>
    </article>`;
}
