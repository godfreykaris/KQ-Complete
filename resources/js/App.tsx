// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminComponent from '././components/Admin/AdminComponent';
import ProtectedRoute from '././components/ProtectedRoute';
import SignUpComponent from './components/Auth/SignUpComponent';
import SignInComponent from '././components/Auth/SignInComponent'; // Your login component
import { AuthProvider } from '././context/AuthContext';
import HRMComponent from './components/HR/HRMComponent';

import Data from './Data';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/*<Route path="/" element={<Data />} />*/}
          <Route path="/" element={<SignInComponent />} />
          <Route path="/signin" element={<SignInComponent />} />
          <Route path="/signup" element={<SignUpComponent />} />
          <Route path="/admin/*" element={<ProtectedRoute element={<AdminComponent />} />} />
          <Route path="/hrm/*" element={<ProtectedRoute element={<HRMComponent />} />} />

           {/* Use ProtectedRoute for authenticated routes */}
           
           {/* Add other unprotected routes here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
