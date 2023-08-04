import React, { useContext } from 'react';
import { Navigate, Route } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

interface ProtectedRouteProps {
  path: string;
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ path, element }) => {
  const { authenticated } = useContext(AuthContext);

  return authenticated ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/login" replace={true} />
  );
};

export default ProtectedRoute;
