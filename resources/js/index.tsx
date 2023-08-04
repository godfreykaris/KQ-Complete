import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import AdminComponent from './AdminComponent';
import HRMComponent from './HRMComponent';
import SignInComponent from './SignInComponent';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/app.css';

const domNode = document.getElementById('app');

if (domNode) {
  const accessToken = sessionStorage.getItem('access_token');

  const root = createRoot(domNode);

  root.render(
    <React.StrictMode>
      <Router>
        {accessToken ? (
            <>
              <Route path="/admin" element={<AdminComponent />} />
              <Route path="/hrm" element={<HRMComponent />} />
            </>
          ) : (
            <Route path="/" element={<SignInComponent />} />
          )}
      </Router>
    </React.StrictMode>,
  );
}
