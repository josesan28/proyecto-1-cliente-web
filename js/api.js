//const API_URL = 'http://localhost:8080';

// Helpers internos

async function request(method, path, body = null, isFormData = false) {
  const options = {
    method,
    headers: {},
  };

  if (body) {
    if (isFormData) {
      options.body = body;
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_URL}${path}`, options);

  if (response.status === 204) return null;

  const data = await response.json();

  if (!response.ok) {
    const msg = data?.error || `Error ${response.status}`;
    throw new Error(msg);
  }

  return data;
}

// Series

const api = {
  getSeries(params = {}) {
    const query = new URLSearchParams();
    if (params.page)  query.set('page',  params.page);
    if (params.limit) query.set('limit', params.limit);
    if (params.q)     query.set('q',     params.q);
    if (params.sort)  query.set('sort',  params.sort);
    if (params.order) query.set('order', params.order);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return request('GET', `/series${qs}`);
  },

  getSerie(id) {
    return request('GET', `/series/${id}`);
  },

  createSerie(formData) {
    return request('POST', '/series', formData, true);
  },

  updateSerie(id, formData) {
    return request('PUT', `/series/${id}`, formData, true);
  },

  deleteSerie(id) {
    return request('DELETE', `/series/${id}`);
  },

  // Géneros

  getGeneros() {
    return request('GET', '/generos');
  },

  createGenero(nombre) {
    return request('POST', '/generos', { nombre });
  },

  // Ratings

  getRatings(serieId) {
    return request('GET', `/series/ratings/${serieId}`);
  },

  createRating(serieId, data) {
    return request('POST', `/series/ratings/${serieId}`, data);
  },

  updateRating(serieId, ratingId, data) {
    return request('PUT', `/series/ratings/${serieId}/${ratingId}`, data);
  },

  deleteRating(serieId, ratingId) {
    return request('DELETE', `/series/ratings/${serieId}/${ratingId}`);
  },
};