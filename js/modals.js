// Modal: Crear / Editar serie
let generosCargados = [];

async function cargarGeneros() {
  try {
    generosCargados = await api.getGeneros();
  } catch {
    generosCargados = [];
  }
}

function renderGenerosCheckboxes(seleccionados = []) {
  const lista = document.getElementById('generos-check-list');
  lista.innerHTML = '';

  generosCargados.forEach(g => {
    const id = `genero-check-${g.id}`;

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'genero-check';
    input.id = id;
    input.value = g.id;
    input.checked = seleccionados.includes(g.id);

    const label = document.createElement('label');
    label.className = 'genero-check-label';
    label.htmlFor = id;
    label.textContent = g.nombre;

    lista.appendChild(input);
    lista.appendChild(label);
  });

  if (generosCargados.length === 0) {
    lista.innerHTML = '<span style="color:var(--text-muted);font-size:12px">No hay géneros registrados</span>';
  }
}

function abrirModalNuevaSerie() {
  document.getElementById('modal-serie-title').textContent = 'Nueva serie';
  document.getElementById('serie-id').value = '';
  document.getElementById('form-serie').reset();
  document.getElementById('imagen-preview').classList.add('hidden');
  document.getElementById('file-drop-label').classList.remove('hidden');
  document.getElementById('form-serie-error').classList.add('hidden');
  renderGenerosCheckboxes([]);
  document.getElementById('modal-serie').classList.remove('hidden');
}

function abrirModalEditarSerie(serie) {
  document.getElementById('modal-serie-title').textContent = 'Editar serie';
  document.getElementById('serie-id').value = serie.id;
  document.getElementById('serie-titulo').value = serie.titulo || '';
  document.getElementById('serie-anio').value = serie.anio || '';
  document.getElementById('serie-episodios').value = serie.episodios || '';
  document.getElementById('serie-descripcion').value = serie.descripcion || '';
  document.getElementById('form-serie-error').classList.add('hidden');

  if (serie.image_path) {
    const preview = document.getElementById('imagen-preview');
    preview.src = `${API_URL}${serie.image_path}`;
    preview.classList.remove('hidden');
    document.getElementById('file-drop-label').classList.add('hidden');
  } else {
    document.getElementById('imagen-preview').classList.add('hidden');
    document.getElementById('file-drop-label').classList.remove('hidden');
  }

  const idsSeleccionados = (serie.generos || []).map(g => g.id);
  renderGenerosCheckboxes(idsSeleccionados);

  document.getElementById('modal-serie').classList.remove('hidden');
}

function cerrarModalSerie() {
  document.getElementById('modal-serie').classList.add('hidden');
}

async function manejarSubmitSerie(e) {
  e.preventDefault();

  const id = document.getElementById('serie-id').value;
  const errEl = document.getElementById('form-serie-error');
  errEl.classList.add('hidden');

  const titulo = document.getElementById('serie-titulo').value.trim();
  if (!titulo) {
    errEl.textContent = 'El título es requerido.';
    errEl.classList.remove('hidden');
    return;
  }

  const checks = document.querySelectorAll('.genero-check:checked');
  const generoIds = Array.from(checks).map(c => c.value).join(',');

  const formData = new FormData();
  formData.append('titulo', titulo);

  const anio = document.getElementById('serie-anio').value;
  const eps  = document.getElementById('serie-episodios').value;
  const desc = document.getElementById('serie-descripcion').value.trim();

  if (anio) formData.append('anio', anio);
  if (eps)  formData.append('episodios', eps);
  if (desc) formData.append('descripcion', desc);
  if (generoIds) formData.append('genero_ids', generoIds);

  const imgInput = document.getElementById('serie-imagen');
  if (imgInput.files[0]) {
    formData.append('imagen', imgInput.files[0]);
  }

  const btn = document.getElementById('btn-submit-serie');
  btn.textContent = 'Guardando...';
  btn.disabled = true;

  try {
    if (id) {
      await api.updateSerie(id, formData);
      showToast('Serie actualizada', 'success');
    } else {
      await api.createSerie(formData);
      showToast('Serie creada', 'success');
    }
    cerrarModalSerie();
    cargarSeries();
  } catch (err) {
    errEl.textContent = err.message;
    errEl.classList.remove('hidden');
  } finally {
    btn.textContent = 'Guardar';
    btn.disabled = false;
  }
}

function setupFilePreview() {
  document.getElementById('serie-imagen').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const preview = document.getElementById('imagen-preview');
    preview.src = URL.createObjectURL(file);
    preview.classList.remove('hidden');
    document.getElementById('file-drop-label').classList.add('hidden');
  });
}

// Modal: Detalle de serie con Ratings

let serieDetalle = null;

async function abrirDetalle(serieId) {
  try {
    serieDetalle = await api.getSerie(serieId);
  } catch (err) {
    showToast('Error cargando detalle: ' + err.message, 'error');
    return;
  }

  document.getElementById('detalle-titulo').textContent = serieDetalle.titulo;

  const img = document.getElementById('detalle-img');
  const ph  = document.getElementById('detalle-img-placeholder');
  if (serieDetalle.image_path) {
    img.src = `${API_URL}${serieDetalle.image_path}`;
    img.classList.remove('hidden');
    ph.classList.add('hidden');
  } else {
    img.classList.add('hidden');
    ph.classList.remove('hidden');
  }

  const meta = document.getElementById('detalle-meta');
  meta.innerHTML = '';
  if (serieDetalle.anio)      meta.innerHTML += `<span>Año:</span> ${serieDetalle.anio}<br>`;
  if (serieDetalle.episodios) meta.innerHTML += `<span>Episodios:</span> ${serieDetalle.episodios}<br>`;

  document.getElementById('detalle-descripcion').textContent =
    serieDetalle.descripcion || 'Sin descripción.';

  const gEl = document.getElementById('detalle-generos');
  gEl.innerHTML = '';
  (serieDetalle.generos || []).forEach(g => {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = g.nombre;
    gEl.appendChild(tag);
  });

  limpiarFormRating();

  await cargarRatings(serieDetalle.id);

  document.getElementById('modal-detalle').classList.remove('hidden');
}

function cerrarDetalle() {
  document.getElementById('modal-detalle').classList.add('hidden');
  serieDetalle = null;
}

// Ratings

async function cargarRatings(serieId) {
  const lista = document.getElementById('ratings-list');
  lista.innerHTML = '';

  try {
    const ratings = await api.getRatings(serieId);

    if (!ratings || ratings.length === 0) {
      lista.innerHTML = '<p class="ratings-empty">Sin ratings aún.</p>';
      return;
    }

    ratings.forEach(rt => {
      lista.appendChild(crearItemRating(rt));
    });

  } catch {
    lista.innerHTML = '<p class="ratings-empty">Error cargando ratings.</p>';
  }
}

function crearItemRating(rt) {
  const item = document.createElement('div');
  item.className = 'rating-item';
  item.dataset.id = rt.id;

  const score = document.createElement('div');
  score.className = 'rating-score';
  score.textContent = rt.valoracion;

  const content = document.createElement('div');
  content.className = 'rating-content';

  const review = document.createElement('p');
  review.className = 'rating-review';
  review.textContent = rt.review || '—';

  const fecha = document.createElement('p');
  fecha.className = 'rating-date';
  fecha.textContent = new Date(rt.creado_a).toLocaleDateString('es-GT');

  content.appendChild(review);
  content.appendChild(fecha);

  const acciones = document.createElement('div');
  acciones.className = 'rating-actions';

  const btnEdit = document.createElement('button');
  btnEdit.className = 'btn-icon';
  btnEdit.textContent = '✎';
  btnEdit.title = 'Editar';
  btnEdit.addEventListener('click', () => cargarRatingEnForm(rt));

  const btnDel = document.createElement('button');
  btnDel.className = 'btn-icon danger';
  btnDel.textContent = '✕';
  btnDel.title = 'Eliminar';
  btnDel.addEventListener('click', () => eliminarRating(rt.id));

  acciones.appendChild(btnEdit);
  acciones.appendChild(btnDel);

  item.appendChild(score);
  item.appendChild(content);
  item.appendChild(acciones);
  return item;
}

function cargarRatingEnForm(rt) {
  document.getElementById('rating-id-edit').value = rt.id;
  document.getElementById('rating-valor').value = rt.valoracion;
  document.getElementById('rating-review').value = rt.review || '';
  document.getElementById('btn-submit-rating').textContent = 'Actualizar rating';
}

function limpiarFormRating() {
  document.getElementById('rating-id-edit').value = '';
  document.getElementById('rating-valor').value = '';
  document.getElementById('rating-review').value = '';
  document.getElementById('btn-submit-rating').textContent = 'Agregar rating';
  document.getElementById('form-rating-error').classList.add('hidden');
}

async function manejarSubmitRating(e) {
  e.preventDefault();

  if (!serieDetalle) return;

  const errEl = document.getElementById('form-rating-error');
  errEl.classList.add('hidden');

  const valoracion = parseInt(document.getElementById('rating-valor').value);
  const review = document.getElementById('rating-review').value.trim() || null;
  const ratingIdEdit = document.getElementById('rating-id-edit').value;

  if (isNaN(valoracion) || valoracion < 1 || valoracion > 10) {
    errEl.textContent = 'La valoración debe ser un número entre 1 y 10.';
    errEl.classList.remove('hidden');
    return;
  }

  const btn = document.getElementById('btn-submit-rating');
  btn.disabled = true;

  try {
    if (ratingIdEdit) {
      await api.updateRating(serieDetalle.id, ratingIdEdit, { valoracion, review });
      showToast('Rating actualizado', 'success');
    } else {
      await api.createRating(serieDetalle.id, { valoracion, review });
      showToast('Rating agregado', 'success');
    }
    limpiarFormRating();
    await cargarRatings(serieDetalle.id);
  } catch (err) {
    errEl.textContent = err.message;
    errEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
  }
}

async function eliminarRating(ratingId) {
  if (!serieDetalle) return;
  try {
    await api.deleteRating(serieDetalle.id, ratingId);
    showToast('Rating eliminado', 'success');
    await cargarRatings(serieDetalle.id);
  } catch (err) {
    showToast('Error eliminando rating: ' + err.message, 'error');
  }
}

// Modal: Confirmación de eliminación

let serieParaEliminar = null;

function abrirConfirmarEliminar(serie) {
  serieParaEliminar = serie;
  document.getElementById('modal-confirmar').classList.remove('hidden');
}

function cerrarConfirmar() {
  document.getElementById('modal-confirmar').classList.add('hidden');
  serieParaEliminar = null;
}

async function confirmarEliminar() {
  if (!serieParaEliminar) return;

  try {
    await api.deleteSerie(serieParaEliminar.id);
    showToast('Serie eliminada', 'success');
    cerrarConfirmar();
    cerrarDetalle();
    cargarSeries();
  } catch (err) {
    showToast('Error eliminando: ' + err.message, 'error');
  }
}

window.abrirModalNuevaSerie  = abrirModalNuevaSerie;
window.abrirModalEditarSerie = abrirModalEditarSerie;
window.abrirDetalle = abrirDetalle;
window.abrirConfirmarEliminar = abrirConfirmarEliminar;
window.cargarGeneros = cargarGeneros;