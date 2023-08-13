// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminComponent from '././components/Admin/AdminComponent';
import ProtectedRoute from '././components/ProtectedRoute';
import SignUpComponent from './components/Auth/SignUpComponent';
import SignInComponent from '././components/Auth/SignInComponent'; // Your login component
import HRMComponent from './components/HR/HRMComponent';
import DefaultComponent from './components/Default/DefaultComponent';

import { AuthProvider } from './context/AuthContext';

const App = () => {
  
  return (
    <AuthProvider>
      <Router>        
        <Routes>    

          <Route path="*" element={<DefaultComponent />} />
          <Route path="/signin" element={<SignInComponent />} />
          <Route path="/signup" element={<SignUpComponent />} />
          <Route path="/admin/*" element={<ProtectedRoute element={<AdminComponent />} />} />
          <Route path="/hrm/*" element={<ProtectedRoute element={<HRMComponent />} />} />
           
           {/* Add other unprotected routes here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
