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

  // Cargar lista de series
  try {
    const data = await api.getSeries();
    console.log('Series cargadas:', data?.data?.length || 0);
  } catch (err) {
    console.error('Error cargando series:', err);
  }

  // Botón "Nueva serie"
  document.getElementById('btn-nueva-serie').addEventListener('click', () => {
    console.log('Abrir modal de nueva serie (próximamente)');
  });
});