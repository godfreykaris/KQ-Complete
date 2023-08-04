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
          <Route path="/signin" element={<SignInComponent />} />
          {/* Use ProtectedRoute for AdminComponent */}
          <ProtectedRoute path="/admin" element={<AdminComponent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
