import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Menu as MuiMenu, MenuItem, Typography, IconButton } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import NormalText from '../../components/NormalText';

const StyledMenu = styled.div`
  grid-area: menu;
`;

const StyledAdminMenu = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.palette.box.main};
`;

const StyledNormalText = styled(NormalText)`
  padding-left: 1rem;
  font-weight: bold;
  padding-top: 0.5rem;
  text-transform: uppercase;
`;

const StyledMenuItemText = styled(Typography)`
  padding-left: 0.5rem;
`;

const StyledMenuButton = styled(Button)`
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: none;
  }
`;

const StyledMobileMenuButton = styled(IconButton)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: none;
  }
`;

interface MenuProps {
  handleLogout: () => void;
  menuButtonLabel: string;
}

const Menu: FC<MenuProps> = ({ menuButtonLabel, handleLogout }) => {
  const user = useSelector((store: RootStore) => store.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const history = useHistory();

  const handleClickMenuAnchor = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickMenuItem = (newPath: string) => {
    setAnchorEl(null);
    if (newPath !== `${history.location.pathname}${history.location.search}`) {
      history.push(newPath);
    }
  };

  return (
    <StyledMenu>
      <StyledMenuButton
        color="primary"
        aria-controls="menu"
        aria-haspopup="true"
        onClick={handleClickMenuAnchor}
        data-testid="menu"
        endIcon={anchorEl ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}>
        <Typography noWrap>{menuButtonLabel}</Typography>
      </StyledMenuButton>
      <StyledMobileMenuButton onClick={handleClickMenuAnchor}>
        <AccountCircle />
      </StyledMobileMenuButton>
      <MuiMenu
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        keepMounted
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        {user.isCurator && (
          <StyledAdminMenu>
            <StyledNormalText>{t('profile:roles.curator')}</StyledNormalText>
            <MenuItem data-testid="menu-my-worklist-button" onClick={() => handleClickMenuItem('/worklist')}>
              <StyledMenuItemText>{t('workLists:my_worklist')}</StyledMenuItemText>
            </MenuItem>
          </StyledAdminMenu>
        )}
        {(user.isAppAdmin || user.isInstitutionAdmin) && (
          <StyledAdminMenu>
            <StyledNormalText>{t('common:admin')}</StyledNormalText>
            {user.isAppAdmin && (
              <MenuItem
                data-testid="menu-admin-institution-button"
                onClick={() => handleClickMenuItem('/admin-institutions')}>
                <StyledMenuItemText>{t('common:institutions')}</StyledMenuItemText>
              </MenuItem>
            )}
            {user.isInstitutionAdmin && (
              <>
                <MenuItem
                  data-testid="menu-admin-institution-button"
                  onClick={() => handleClickMenuItem('/my-institution')}>
                  <StyledMenuItemText>{t('common:my_institution')}</StyledMenuItemText>
                </MenuItem>
                <MenuItem
                  data-testid="menu-admin-institution-users-button"
                  onClick={() => handleClickMenuItem('/my-institution-users')}>
                  <StyledMenuItemText>{t('common:users')}</StyledMenuItemText>
                </MenuItem>
              </>
            )}
          </StyledAdminMenu>
        )}
        <MenuItem data-testid="menu-user-profile-button" onClick={() => handleClickMenuItem('/user')}>
          {t('profile:my_profile')}
        </MenuItem>
        <MenuItem onClick={handleLogout} data-testid="menu-logout-button">
          {t('authorization:logout')}
        </MenuItem>
      </MuiMenu>
    </StyledMenu>
  );
};

export default Menu;
