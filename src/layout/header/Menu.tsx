import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { Button, Menu as MuiMenu, MenuItem } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import { checkIfPublisher } from '../../utils/authorization';

interface MenuProps {
  handleLogout: () => void;
  menuButtonLabel: string;
}

const StyledMenu = styled.div`
  grid-area: menu;
`;

const StyledMuiMenu = styled(MuiMenu)`
  .MuiMenu-list {
    width: 15rem;
    border: 3px solid ${({ theme }) => theme.palette.box.main};

    @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
      width: 10rem;
    }
  }
`;

const StyledMenuButton = styled(Button)`
  width: 15rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 10rem;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  border-bottom: 1px solid ${({ theme }) => theme.palette.box.main};
`;

const Menu: React.FC<MenuProps> = ({ menuButtonLabel, handleLogout }) => {
  const user = useSelector((store: RootStore) => store.user);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const history = useHistory();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isPublisher = checkIfPublisher(user);

  return (
    <StyledMenu>
      <StyledMenuButton
        color="primary"
        variant="contained"
        aria-controls="menu"
        aria-haspopup="true"
        onClick={handleClick}
        data-testid="menu">
        {menuButtonLabel}
        {anchorEl ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </StyledMenuButton>
      <StyledMuiMenu
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        <StyledMenuItem
          data-testid="menu-user-profile-button"
          onClick={() => {
            handleClose();
            history.push('/user');
          }}>
          {t('profile:my_profile')}
        </StyledMenuItem>

        {isPublisher && (
          <StyledMenuItem
            data-testid="menu-my-publications-button"
            onClick={() => {
              handleClose();
              history.push('/my-publications');
            }}>
            {t('workLists:my_publications')}
          </StyledMenuItem>
        )}

        <StyledMenuItem onClick={handleLogout} data-testid="menu-logout-button">
          {t('logout')}
        </StyledMenuItem>
      </StyledMuiMenu>
    </StyledMenu>
  );
};

export default Menu;
