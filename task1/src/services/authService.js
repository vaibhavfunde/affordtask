import axios from 'axios';

// Use relative URL for proxy
const API_BASE_URL = '/evaluation-service';

// Store credentials in localStorage to persist them
const CREDENTIALS_KEY = 'stock_app_credentials';

let authToken = null;
let clientId = null;
let clientSecret = null;

// Load credentials from localStorage if they exist
const loadCredentials = () => {
  try {
    const savedCredentials = localStorage.getItem(CREDENTIALS_KEY);
    if (savedCredentials) {
      const { clientID, clientSecret: secret } = JSON.parse(savedCredentials);
      clientId = clientID;
      clientSecret = secret;
      return true;
    }
  } catch (error) {
    console.error('Error loading credentials:', error);
  }
  return false;
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const register = async () => {
  try {
    // Check if we already have credentials
    if (loadCredentials()) {
      console.log('Using existing credentials');
      return;
    }

    // If no credentials exist, we'll proceed without registration
    console.log('No credentials found, proceeding without registration');
    return;
  } catch (error) {
    console.error('Registration error:', error);
    // Even if there's an error, we'll proceed without registration
    return;
  }
};

export const getAuthToken = async () => {
  if (!authToken && clientId && clientSecret) {
    try {
      const response = await api.post('/auth', {
        clientID: clientId,
        clientSecret: clientSecret
      });
      authToken = response.data.access_token;
      return authToken;
    } catch (error) {
      console.error('Authentication error:', error);
      // Return null if authentication fails
      return null;
    }
  }
  return authToken;
};

export const getAuthHeaders = async () => {
  const token = await getAuthToken();
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
}; 