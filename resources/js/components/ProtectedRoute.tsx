import React, { useContext } from 'react';
import { Navigate, Route, PathRouteProps } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

interface ProtectedRouteProps extends PathRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, ...rest }) => {
  const accessToken = sessionStorage.getItem('access_token');

  return accessToken ? (
    element
  ) : (
    <Navigate to="/signin" replace={true} />
  );
};

export default ProtectedRoute;
