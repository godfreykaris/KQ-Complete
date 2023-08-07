// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminComponent from '././components/Admin/AdminComponent';
import ProtectedRoute from '././components/ProtectedRoute';
import SignUpComponent from './components/Auth/SignUpComponent';
import SignInComponent from '././components/Auth/SignInComponent'; // Your login component
import { AuthProvider } from '././context/AuthContext';
import HRMComponent from './components/HR/HRMComponent';
import router from "./components/Default/src/router.jsx";



import Data from './Data';


const App = () => {
  //alert(JSON.stringify(router[0].children))

  
  return (
    <AuthProvider>
      <Router>        
        <Routes>
          {/*<Route path="/" element={<Data />} />*/} 
          {router.map((route: any, index: number) =>(
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))} 
                  
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
