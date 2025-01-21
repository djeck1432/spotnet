import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from 'App';
import { StarknetProvider } from 'starknet-provider';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <QueryClientProvider client={queryClient}>
    <StarknetProvider>
    <Router>
      <App />
    </Router>
    </StarknetProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
