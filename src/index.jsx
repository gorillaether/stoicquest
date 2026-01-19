// src/index.jsx (or src/main.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';

// --- Buffer Polyfill for Vite ---
import { Buffer } from 'buffer';
window.Buffer = Buffer;
// --- End Buffer Polyfill ---

import './index.css'; // Your global styles
import App from './App'; // Your main App component
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './contexts/UserContext'; // <<< --- 1. IMPORT UserProvider
// If you use React Router, ensure BrowserRouter is also set up,
// typically it would wrap UserProvider or App component itself.
// For example, if App.js contains BrowserRouter:
// import { BrowserRouter } from 'react-router-dom'; (This might already be in your App.js)


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* If using React Router and it's not inside App.js, it might go here: */}
    {/* <BrowserRouter> */}
      <UserProvider> {/* <<< --- 2. WRAP YOUR APP WITH UserProvider */}
        <App />
      </UserProvider>
    {/* </BrowserRouter> */}
  </React.StrictMode>
);

reportWebVitals();