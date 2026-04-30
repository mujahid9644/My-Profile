const localBackend = 'http://127.0.0.1:8000';
const productionBackend = 'https://my-profile-kufe.onrender.com';
const envBackend = import.meta.env.VITE_API_BASE_URL?.trim();
const isLocalhost = window.location.hostname === '127.0.0.1'
  || window.location.hostname === 'localhost'
  || window.location.hostname === '';

export const API_BASE_URL = (envBackend || (isLocalhost ? localBackend : productionBackend)).replace(/\/$/, '');

console.log('Chatbot API base URL:', API_BASE_URL);
