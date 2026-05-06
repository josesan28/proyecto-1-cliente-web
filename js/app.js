const API_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Series Tracker iniciado');

  // Cargar géneros
  try {
    const generos = await api.getGeneros();
    console.log('Géneros cargados:', generos.length);
  } catch (err) {
    console.error('Error cargando géneros:', err);
  }

  // Cargar grid de series
  cargarSeries();

  // Botón de Nueva serie
  document.getElementById('btn-nueva-serie').addEventListener('click', () => {
    console.log('Abrir modal de nueva serie (próximamente)');
  });
});