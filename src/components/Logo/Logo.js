import React from 'react';
import './Logo.css';
import logoImage from '../imgs/Imagem_do_WhatsApp_de_2024-04-30_à_s__12.53.06_24f6df1d-removebg-preview.png';

const Logo = () => {
  return (
    <div className="logo-container">
      <img src={logoImage} alt="ITMF Logo" className="logo" />
    </div>
  );
};

export default Logo;