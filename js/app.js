//const API_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', async () => {

  await cargarGeneros();

  cargarSeries();

  setupBusqueda();
  setupOrdenamiento();
  setupFilePreview();

  // Header
  document.getElementById('btn-nueva-serie').addEventListener('click', () => {
    abrirModalNuevaSerie();
  });

  // Exportar CSV
  document.getElementById('btn-export-csv').addEventListener('click', exportarCSV);

  // Límite de paginación
  document.getElementById('select-limit').addEventListener('change', e => {
    state.limit = parseInt(e.target.value);
    state.page = 1;
    cargarSeries();
  });

  // Nuevo género desde modal
  document.getElementById('btn-agregar-genero').addEventListener('click', crearGeneroDesdeModal);
  document.getElementById('nuevo-genero-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); crearGeneroDesdeModal(); }
  });

  // Modal serie: cerrar
  document.getElementById('modal-serie-close').addEventListener('click', cerrarModalSerie);
  document.getElementById('btn-cancelar-serie').addEventListener('click', cerrarModalSerie);

  document.getElementById('modal-serie').addEventListener('click', function (e) {
    if (e.target === this) cerrarModalSerie();
  });

  // Modal serie: submit
  document.getElementById('form-serie').addEventListener('submit', manejarSubmitSerie);

  // Modal detalle: cerrar
  document.getElementById('modal-detalle-close').addEventListener('click', cerrarDetalle);
  document.getElementById('modal-detalle').addEventListener('click', function (e) {
    if (e.target === this) cerrarDetalle();
  });

  // Botones dentro del detalle
  document.getElementById('btn-editar-desde-detalle').addEventListener('click', () => {
    if (!serieDetalle) return;
    const serie = serieDetalle;
    cerrarDetalle();
    abrirModalEditarSerie(serie);
  });

  document.getElementById('btn-eliminar-desde-detalle').addEventListener('click', () => {
    if (!serieDetalle) return;
    abrirConfirmarEliminar(serieDetalle);
  });

  // Modal detalle: submit rating
  document.getElementById('form-rating').addEventListener('submit', manejarSubmitRating);

  // Modal confirmar: botones
  document.getElementById('modal-confirmar-close').addEventListener('click', cerrarConfirmar);
  document.getElementById('btn-cancelar-eliminar').addEventListener('click', cerrarConfirmar);
  document.getElementById('btn-confirmar-eliminar').addEventListener('click', confirmarEliminar);
  document.getElementById('modal-confirmar').addEventListener('click', function (e) {
    if (e.target === this) cerrarConfirmar();
  });

  // Cerrar modales con Escape
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!document.getElementById('modal-serie').classList.contains('hidden'))     cerrarModalSerie();
    if (!document.getElementById('modal-detalle').classList.contains('hidden'))   cerrarDetalle();
    if (!document.getElementById('modal-confirmar').classList.contains('hidden')) cerrarConfirmar();
  });
});