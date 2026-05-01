import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach token automatically from localStorage
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ─── Auth ─────────────────────────────────────────
export const registerUser  = (data) => API.post('/auth/register', data);
export const loginUser     = (data) => API.post('/auth/login', data);
export const getMe         = ()     => API.get('/auth/me');

// ─── Events ───────────────────────────────────────
export const fetchEvents   = (params) => API.get('/events', { params });
export const fetchEvent    = (id)     => API.get(`/events/${id}`);
export const createEvent   = (data)   => API.post('/events', data);
export const updateEvent   = (id, data) => API.put(`/events/${id}`, data);
export const deleteEvent   = (id)     => API.delete(`/events/${id}`);

// ─── Registrations ────────────────────────────────
export const rsvpEvent           = (eventId) => API.post(`/registrations/${eventId}`);
export const cancelRSVP          = (eventId) => API.put(`/registrations/${eventId}/cancel`);
export const getMyRegistrations  = ()        => API.get('/registrations/my');
export const getAttendees        = (eventId) => API.get(`/registrations/${eventId}/attendees`);

// ─── Check-In (QR Based) ──────────────────────────
export const checkInEvent        = (eventId, data) => API.post(`/check-in/${eventId}`, data);
export const getCheckInStatus    = (eventId)      => API.get(`/check-in/${eventId}`);

// ─── Analytics ────────────────────────────────────
export const getEventAnalytics   = (eventId) => API.get(`/analytics/${eventId}`);
export const getAllAnalytics     = ()        => API.get('/analytics');

// ─── Image Uploads ────────────────────────────────
export const uploadEventImage    = (eventId, formData) => API.post(`/uploads/event/${eventId}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const getEventImage       = (eventId) => API.get(`/uploads/event/${eventId}`);
