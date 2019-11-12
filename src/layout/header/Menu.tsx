import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { Button, Menu as MuiMenu, MenuItem } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import styled from 'styled-components';

interface MenuProps {
  handleLogout: () => void;
  menuButtonLabel: string;
}

const StyledMenu = styled.div`
  grid-area: menu;

  .MuiButton-root {
    width: 15rem;

    @media only screen and (max-width: 600px) {
      width: 10rem;
    }
  }
`;

const StyledMuiMenu = styled(MuiMenu)`
  .MuiMenu-list {
    width: 15rem;
    border: 3px solid ${({ theme }) => theme.palette.box.main};

    @media only screen and (max-width: 600px) {
      width: 10rem;
    }

    .MuiMenuItem-root {
      border-bottom: 1px solid ${({ theme }) => theme.palette.box.main};
    }
  }
`;

const Menu: React.FC<MenuProps> = ({ menuButtonLabel, handleLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const history = useHistory();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledMenu>
      <Button
        color="primary"
        variant="contained"
        aria-controls="menu"
        aria-haspopup="true"
        onClick={handleClick}
        data-testid="menu">
        {menuButtonLabel}
        {anchorEl ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </Button>
      <StyledMuiMenu
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        <MenuItem
          data-testid="user-profile-button"
          onClick={() => {
            handleClose();
            history.push('/user');
          }}>
          {t('My profile')}
        </MenuItem>

        <MenuItem onClick={handleLogout} data-testid="logout-button">
          {t('Logout')}
        </MenuItem>
      </StyledMuiMenu>
    </StyledMenu>
  );
};

export default Menu;
