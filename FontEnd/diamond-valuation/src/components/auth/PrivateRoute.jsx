import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';// Adjust the path as necessary
import { validateToken } from '../utils/ApiFunctions';

const PrivateRoute = ({ children }) => {
  const auth = localStorage.getItem('token')
  const location = useLocation();
  if (auth === null) {
    // Redirect them to the login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the children components
  return children;
};

export default PrivateRoute;