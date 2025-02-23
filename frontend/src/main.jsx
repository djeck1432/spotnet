import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import AppRouter from './app/router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter>
      <App />
      <TanStackRouterDevtools initialIsOpen={false} position="bottom-right" />
    </AppRouter>
  </React.StrictMode>
);
