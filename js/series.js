// Estado de la vista
const state = {
  page: 1,
  limit: 12,
  q: '',
  sort: 'creado_a',
  order: 'desc',
  totalPages: 1,
};

// Cargar y renderizar series 

async function cargarSeries() {
  mostrarEstado('loading');

  try {
    const data = await api.getSeries({ page: state.page, limit: state.limit });

    if (data.total === 0) {
      mostrarEstado('empty');
      return;
    }

    mostrarEstado('grid');
    renderGrid(data.data);

  } catch (err) {
    mostrarEstado('empty');
    console.error('Error cargando series:', err);
  }
}

function renderGrid(series) {
  const grid = document.getElementById('series-grid');
  grid.innerHTML = '';

  series.forEach(serie => {
    const card = crearTarjeta(serie);
    grid.appendChild(card);
  });
}

function crearTarjeta(serie) {
  const card = document.createElement('div');
  card.className = 'serie-card';
  card.dataset.id = serie.id;

  const imgWrap = document.createElement('div');
  imgWrap.className = 'card-img-wrap';

  if (serie.image_path) {
    const img = document.createElement('img');
    img.className = 'card-img';
    img.src = `${API_URL}${serie.image_path}`;
    img.alt = serie.titulo;
    img.loading = 'lazy';
    imgWrap.appendChild(img);
  } else {
    const ph = document.createElement('div');
    ph.className = 'card-img-placeholder';
    ph.textContent = '◫';
    imgWrap.appendChild(ph);
  }

  const body = document.createElement('div');
  body.className = 'card-body';

  const titulo = document.createElement('p');
  titulo.className = 'card-titulo';
  titulo.textContent = serie.titulo;

  const meta = document.createElement('div');
  meta.className = 'card-meta';
  if (serie.anio)      meta.innerHTML += `<span>${serie.anio}</span>`;
  if (serie.episodios) meta.innerHTML += `<span>${serie.episodios} ep.</span>`;

  const generos = document.createElement('div');
  generos.className = 'card-generos';
  (serie.generos || []).slice(0, 3).forEach(g => {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = g.nombre;
    generos.appendChild(tag);
  });

  body.appendChild(titulo);
  body.appendChild(meta);
  body.appendChild(generos);

  card.appendChild(imgWrap);
  card.appendChild(body);

  card.addEventListener('click', () => {
    console.log('Abrir detalle de serie:', serie.id);
  });

  return card;
}

// Estados de UI 

function mostrarEstado(tipo) {
  document.getElementById('state-loading').classList.add('hidden');
  document.getElementById('state-empty').classList.add('hidden');
  document.getElementById('state-no-results').classList.add('hidden');
  document.getElementById('series-grid').classList.add('hidden');

  switch (tipo) {
    case 'loading':
      document.getElementById('state-loading').classList.remove('hidden');
      break;
    case 'empty':
      document.getElementById('state-empty').classList.remove('hidden');
      break;
    case 'no-results':
      document.getElementById('state-no-results').classList.remove('hidden');
      break;
    case 'grid':
      document.getElementById('series-grid').classList.remove('hidden');
      break;
  }
}

window.cargarSeries = cargarSeries;