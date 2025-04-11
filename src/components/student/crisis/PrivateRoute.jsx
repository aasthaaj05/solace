import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

function PrivateRoute2({ children }) {
  const { currentUser  } = useAuth();
  
  return currentUser  ? children : <Navigate to="/login" />;
}

export default PrivateRoute2;