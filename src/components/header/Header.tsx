import React from 'react';

import '../../styles/header.scss';
import Login from '../login/Login';
import Menu from './Menu';
import { Typography } from '@material-ui/core';

const Header: React.FC = () => (
  <div className="header">
    <div className="logo">
      <Typography variant="h6">NVA</Typography>
    </div>
    <Login buttonText="login" />
    <Menu />
  </div>
);

export default Header;
