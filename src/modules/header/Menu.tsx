import { Menu as MUIMenu } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import '../../styles/menu.scss';

const Menu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { t } = useTranslation();

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
          {t('Menu')}
        </Button>
      </div>
      <MUIMenu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <NavLink to="/">{t('Dashboard')}</NavLink>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <NavLink to="/user">{t('My profile')}</NavLink>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <NavLink to="/resources/new">{t('New resource')}</NavLink>
        </MenuItem>
      </MUIMenu>
    </div>
  );
};

export default Menu;
