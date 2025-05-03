import api from './axios';

// GET: List today's visits
export const getTodaysVisits = () => api.get('/visits/today/');

// POST: Add a new visit
export const addVisit = (data) => api.post('/visits/', data);
