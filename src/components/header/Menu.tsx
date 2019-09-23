import React from 'react';
import Button from '@material-ui/core/Button';
import { Menu as MUIMenu, Icon } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { NavLink } from 'react-router-dom';

import '../../styles/menu.scss';

const Menu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="menu">
      <div className="menu__button">
        <Button aria-controls="menu" aria-haspopup="true" onClick={handleClick}>
          Menu
        </Button>
      </div>
      <MUIMenu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <NavLink to="/">Dashboard</NavLink>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <NavLink to="/user">My profile</NavLink>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <NavLink to="/resources/new">New Resource</NavLink>
        </MenuItem>
      </MUIMenu>
    </div>
  );
};

export default Menu;
