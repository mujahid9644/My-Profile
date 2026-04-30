const localBackend = 'http://127.0.0.1:8000';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' || window.location.hostname === ''
    ? localBackend
    : '');
