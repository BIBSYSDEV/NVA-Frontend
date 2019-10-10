import '../../styles/menu.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { Button, Menu as MUIMenu } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

export interface MenuProps {
  handleLogout: () => void;
  menuButtonLabel: string;
}

const Menu: React.FC<MenuProps> = ({ menuButtonLabel, handleLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { t } = useTranslation();
  const history = useHistory();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(!menuOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  return (
    <div className="menu">
      <Button aria-controls="menu" aria-haspopup="true" onClick={handleClick} data-cy="menu">
        {menuButtonLabel}
        {menuOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </Button>
      <MUIMenu
        anchorEl={anchorEl}
        elevation={0}
        getContentAnchorEl={null}
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        <div className="menu-list">
          <MenuItem
            onClick={() => {
              handleClose();
              history.push('/');
            }}>
            {t('Dashboard')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              history.push('/user');
            }}>
            {t('My profile')}
          </MenuItem>

          <MenuItem onClick={handleLogout} data-cy="logout-button">
            {t('Logout')}
          </MenuItem>
        </div>
      </MUIMenu>
    </div>
  );
};

export default Menu;
