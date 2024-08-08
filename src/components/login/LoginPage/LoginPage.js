import React from 'react';
import Logo from '../../Logo/Logo';
import LoginForm from '../LoginForm/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page-container">
      <div className="logo-section">
        <Logo />
      </div>
      <div className="form-section">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
