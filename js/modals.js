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

window.abrirModalNuevaSerie = abrirModalNuevaSerie;
window.abrirModalEditarSerie = abrirModalEditarSerie;
window.cargarGeneros = cargarGeneros;