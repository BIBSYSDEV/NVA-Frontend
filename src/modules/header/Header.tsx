import React from 'react';

import '../../styles/header.scss';
import Login from '../login/Login';
import Menu from './Menu';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
  <div className="header">
    <Link to="/">
      <div className="logo">
        <Typography variant="h6">NVA</Typography>
      </div>
    </Link>
    <Login buttonText="login" />
    <Menu />
  </div>
);

export default Header;
