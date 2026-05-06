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
});