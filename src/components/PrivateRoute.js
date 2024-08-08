import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ children }) => {
  const username = Cookies.get('username');

  if (!username) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
