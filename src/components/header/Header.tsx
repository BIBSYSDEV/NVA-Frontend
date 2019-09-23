import React from 'react';

import '../../styles/header.scss';
import Login from '../login/Login';
import Menu from './Menu';

const Header: React.FC = () => (
  <div className="header">
    <div className="logo">NVA</div>
    <Login buttonText="login" />
    <Menu />
  </div>
);

export default Header;
