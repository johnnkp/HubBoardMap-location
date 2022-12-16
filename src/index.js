import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './bootstrap.scheme.css';

// Experimental: import empty service worker for PWA
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Experimental: register service worker
serviceWorkerRegistration.register();
