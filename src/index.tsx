import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './store';
import { RootState } from './store';

// Set base URL
axios.defaults.baseURL = 'https://kavoogo-api.kavooapp.com';

// Add request interceptor for token
axios.interceptors.request.use((config) => {
  const state = store.getState() as RootState;
  const token = state.auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
