import axios from 'axios';

// Si existe una variable de entorno usará esa, sino, usará el localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Funciones para Instructores
export const getInstructores = () => api.get('/instructors/');
export const createInstructor = (data) => api.post('/instructors/', data);
export const updateInstructor = (id, data) => api.put(`/instructors/${id}/`, data); // NUEVO
export const deleteInstructor = (id) => api.delete(`/instructors/${id}/`);

// Funciones para Talleres
export const getTalleres = () => api.get('/talleres/');
export const createTaller = (formData) => api.post('/talleres/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' } 
});
export const updateTaller = (id, formData) => api.patch(`/talleres/${id}/`, formData, { // NUEVO
  headers: { 'Content-Type': 'multipart/form-data' } 
});
export const deleteTaller = (id) => api.delete(`/talleres/${id}/`);