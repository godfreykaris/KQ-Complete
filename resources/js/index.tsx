import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/app.css';

const domNode = document.getElementById('app');

if(domNode)
{
  const root = createRoot(domNode);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    
  );
}

