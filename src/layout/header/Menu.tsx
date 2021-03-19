import React, { useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Menu as MuiMenu, MenuItem, Typography, IconButton, Divider } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import { UrlPathTemplate } from '../../utils/urlPaths';

const StyledMenu = styled.div`
  grid-area: menu;
`;

const StyledMenuButton = styled(Button)`
  text-transform: none;
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

export const Menu = ({ menuButtonLabel, handleLogout }: MenuProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootStore) => store.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickMenuAnchor = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  return (
    <StyledMenu>
      <StyledMenuButton
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
        {user?.isCurator && (
          <MenuItem
            key="menu-my-worklist-button"
            data-testid="menu-my-worklist-button"
            component={Link}
            to={UrlPathTemplate.Worklist}
            onClick={closeMenu}
            divider>
            {t('workLists:my_worklist')}
          </MenuItem>
        )}
        {(user?.isAppAdmin || user?.isInstitutionAdmin) && [
          user.isAppAdmin && (
            <MenuItem
              key="menu-admin-institutions-button"
              data-testid="menu-admin-institutions-button"
              component={Link}
              to={UrlPathTemplate.AdminInstitutions}
              onClick={closeMenu}>
              {t('common:institutions')}
            </MenuItem>
          ),
          user.isInstitutionAdmin && [
            <MenuItem
              key="menu-admin-institution-button"
              data-testid="menu-admin-institution-button"
              component={Link}
              to={UrlPathTemplate.MyInstitution}
              onClick={closeMenu}>
              {t('common:my_institution')}
            </MenuItem>,
            <MenuItem
              key="menu-admin-institution-users-button"
              data-testid="menu-admin-institution-users-button"
              component={Link}
              to={UrlPathTemplate.MyInstitutionUsers}
              onClick={closeMenu}>
              {t('common:users')}
            </MenuItem>,
          ],
          <Divider key="divider" />,
        ]}
        <MenuItem
          component={Link}
          to={UrlPathTemplate.MyProfile}
          data-testid="menu-user-profile-button"
          onClick={closeMenu}>
          {t('profile:my_profile')}
        </MenuItem>

        <MenuItem onClick={handleLogout} data-testid="menu-logout-button">
          {t('authorization:logout')}
        </MenuItem>
      </MuiMenu>
    </StyledMenu>
  );
};
