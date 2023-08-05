// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminComponent from '././components/Admin/AdminComponent';
import ProtectedRoute from '././components/ProtectedRoute';
import SignInComponent from '././components/Auth/SignInComponent'; // Your login component
import { AuthProvider } from '././context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignInComponent />} />
          <Route path="/signin" element={<SignInComponent />} />
          <Route path="/admin/*" element={<ProtectedRoute element={<AdminComponent />} />} />
           {/* Use ProtectedRoute for authenticated routes */}
           
           {/* Add other unprotected routes here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
