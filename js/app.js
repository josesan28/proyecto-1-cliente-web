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
  
    document.getElementById('form-rating').addEventListener('submit', manejarSubmitRating);

    // Botones dentro del detalle
  document.getElementById('btn-editar-desde-detalle').addEventListener('click', () => {
    if (!serieDetalle) return;
    cerrarDetalle();
    abrirModalEditarSerie(serieDetalle);
  });

  document.getElementById('btn-eliminar-desde-detalle').addEventListener('click', () => {
    if (!serieDetalle) return;
    abrirConfirmarEliminar(serieDetalle);
  });

  // Modal confirmar: botones
  document.getElementById('modal-confirmar-close').addEventListener('click', cerrarConfirmar);
  document.getElementById('btn-cancelar-eliminar').addEventListener('click', cerrarConfirmar);
  document.getElementById('btn-confirmar-eliminar').addEventListener('click', confirmarEliminar);
  document.getElementById('modal-confirmar').addEventListener('click', function (e) {
    if (e.target === this) cerrarConfirmar();
  });
});