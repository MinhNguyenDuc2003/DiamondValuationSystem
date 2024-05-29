import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';// Adjust the path as necessary

const PrivateRoute = ({ children }) => {
  const auth = useAuth();

  if (!auth.user) {
    // Redirect them to the login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the children components
  return children;
};

export default PrivateRoute;
