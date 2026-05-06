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
    const data = await api.getSeries({
      page:  state.page,
      limit: state.limit,
      q:     state.q,
      sort:  state.sort,
      order: state.order,
    });

    state.totalPages = data.total_pages || 1;

    if (data.total === 0 && state.q) {
      mostrarEstado('no-results');
      renderPaginacion(0);
      return;
    }

    if (data.total === 0) {
      mostrarEstado('empty');
      renderPaginacion(0);
      return;
    }

    mostrarEstado('grid');
    renderGrid(data.data);
    renderPaginacion(data.total_pages);

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

// Búsqueda

let debounceTimer;
function setupBusqueda() {
  const input = document.getElementById('input-busqueda');
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.q = input.value.trim();
      state.page = 1;
      cargarSeries();
    }, 350);
  });
}

// Ordenamiento

function setupOrdenamiento() {
  document.getElementById('select-sort').addEventListener('change', e => {
    state.sort = e.target.value;
    state.page = 1;
    cargarSeries();
  });

  document.getElementById('select-order').addEventListener('change', e => {
    state.order = e.target.value;
    state.page = 1;
    cargarSeries();
  });
}

// Paginación

function renderPaginacion(totalPages) {
  const pag = document.getElementById('pagination');
  pag.innerHTML = '';

  if (totalPages <= 1) return;

  // Botón anterior
  const prev = document.createElement('button');
  prev.className = 'page-btn';
  prev.textContent = '←';
  prev.disabled = state.page <= 1;
  prev.addEventListener('click', () => irAPagina(state.page - 1));
  pag.appendChild(prev);

  const range = paginationRange(state.page, totalPages);
  range.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (p === state.page ? ' active' : '');
    btn.textContent = p === '...' ? '…' : p;
    btn.disabled = p === '...';
    if (typeof p === 'number') {
      btn.addEventListener('click', () => irAPagina(p));
    }
    pag.appendChild(btn);
  });

  const next = document.createElement('button');
  next.className = 'page-btn';
  next.textContent = '→';
  next.disabled = state.page >= totalPages;
  next.addEventListener('click', () => irAPagina(state.page + 1));
  pag.appendChild(next);
}

function paginationRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];

  return [1, '...', current - 1, current, current + 1, '...', total];
}

function irAPagina(p) {
  if (p < 1 || p > state.totalPages) return;
  state.page = p;
  cargarSeries();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toast

function showToast(msg, tipo = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

window.showToast = showToast;
window.cargarSeries = cargarSeries;
window.setupBusqueda = setupBusqueda;
window.setupOrdenamiento = setupOrdenamiento;