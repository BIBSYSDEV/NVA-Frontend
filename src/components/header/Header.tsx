import React from 'react';

import '../../styles/header.scss';
import Login from '../login/Login';

const Header: React.FC = () => (
  <div className="header">
    <div className="logo">NVA</div>
    <Login buttonText="login" />
  </div>
);

export default Header;
