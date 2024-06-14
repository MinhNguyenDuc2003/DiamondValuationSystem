import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RouterCustom from './router';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './component/Auth/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <BrowserRouter>
      <RouterCustom></RouterCustom>
    </BrowserRouter>
    </AuthProvider>
);