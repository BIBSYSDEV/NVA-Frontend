import '../../styles/header.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import { Typography } from '@material-ui/core';

import Login from './Login';

const Header: React.FC = () => (
  <div className="header">
    <Link to="/">
      <div className="logo" data-cy="logo">
        <Typography variant="h6">
          <b>NVA</b>
        </Typography>
      </div>
    </Link>
    <Login />
  </div>
);

export default Header;
