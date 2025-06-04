import axios from 'axios';

// Use relative URL for proxy
const API_BASE_URL = '/evaluation-service';

// Registration data
const registrationData = {
  email: "agarath0@gmail.com",
  name: "athfharva kshirsagar",
  rollNo: "225fgd10884",
  mobileNo: "1122334455",
  githubUsername: "atharvakshirsagar",
  collegeName: "ABC College of Engineering",
  accessCode: "KRjUUU",
  clientID: "dd6a68d5-babd-4562-9555-8dcbf806fa7c",
  clientSecret: "AYWwKdFZHvCfyjcm"
};

// Store credentials in localStorage to persist them
const CREDENTIALS_KEY = 'stock_app_credentials';

let authToken = null;
let clientId = registrationData.clientID;
let clientSecret = registrationData.clientSecret;

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

// Save credentials to localStorage
const saveCredentials = (credentials) => {
  try {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  } catch (error) {
    console.error('Error saving credentials:', error);
  }
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

    // First, register with the API
    const registerResponse = await api.post('/register', registrationData);
    console.log('Registration successful:', registerResponse.data);

    // Then, get the auth token
    const authResponse = await api.post('/auth', {
      email: registrationData.email,
      name: registrationData.name,
      rollNo: registrationData.rollNo,
      accessCode: registrationData.accessCode,
      clientID: clientId,
      clientSecret: clientSecret
    });

    // Save the auth token
    authToken = authResponse.data.access_token;
    console.log('Authentication successful');

    // Save credentials for future use
    saveCredentials({ clientID: clientId, clientSecret: clientSecret });
    
    return authResponse.data;
  } catch (error) {
    console.error('Registration/Authentication error:', error);
    if (error.response?.status === 409) {
      // If already registered, try to load saved credentials
      if (loadCredentials()) {
        // Try to get auth token with saved credentials
        try {
          const authResponse = await api.post('/auth', {
            email: registrationData.email,
            name: registrationData.name,
            rollNo: registrationData.rollNo,
            accessCode: registrationData.accessCode,
            clientID: clientId,
            clientSecret: clientSecret
          });
          authToken = authResponse.data.access_token;
          return authResponse.data;
        } catch (authError) {
          console.error('Authentication error with saved credentials:', authError);
        }
      }
    }
    throw error;
  }
};

export const getAuthToken = async () => {
  if (!authToken) {
    try {
      const response = await api.post('/auth', {
        email: registrationData.email,
        name: registrationData.name,
        rollNo: registrationData.rollNo,
        accessCode: registrationData.accessCode,
        clientID: clientId,
        clientSecret: clientSecret
      });

      authToken = response.data.access_token;
      return authToken;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }
  return authToken;
};

export const getAuthHeaders = async () => {
  if (!authToken) {
    await getAuthToken();
  }
  return {
    'Authorization': `Bearer ${authToken}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
}; 