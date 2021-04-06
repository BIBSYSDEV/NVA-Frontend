import React, { useState, MouseEvent, useRef } from 'react';
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

const StyledMenuItem = styled(MenuItem)`
  padding: 0;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
  height: 100%;
`;

const StyledMenuItemText = styled(Typography)`
  padding: 0.5rem 1rem;
`;

interface MenuProps {
  handleLogout: () => void;
  menuButtonLabel: string;
}

export const Menu = ({ menuButtonLabel, handleLogout }: MenuProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootStore) => store.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const divRef = useRef<any>();

  const handleClickMenuAnchor = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  return (
    <StyledMenu>
      <StyledMenuButton
        onClick={handleClickMenuAnchor}
        data-testid="menu"
        endIcon={anchorEl ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}>
        <Typography noWrap>{menuButtonLabel}</Typography>
      </StyledMenuButton>
      <StyledMobileMenuButton onClick={handleClickMenuAnchor}>
        <AccountCircle />
      </StyledMobileMenuButton>
      <div ref={divRef} />
      <MuiMenu
        anchorEl={anchorEl}
        container={divRef.current}
        getContentAnchorEl={null}
        keepMounted
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        {user?.isCurator && (
          <StyledMenuItem key="menu-my-worklist-button" onClick={closeMenu} divider>
            <StyledLink to={UrlPathTemplate.Worklist} data-testid="menu-my-worklist-button">
              <StyledMenuItemText>{t('workLists:my_worklist')}</StyledMenuItemText>
            </StyledLink>
          </StyledMenuItem>
        )}
        {(user?.isAppAdmin || user?.isInstitutionAdmin) && [
          user.isAppAdmin && (
            <StyledMenuItem key="menu-admin-institutions-button" onClick={closeMenu}>
              <StyledLink to={UrlPathTemplate.AdminInstitutions} data-testid="menu-admin-institutions-button">
                <StyledMenuItemText>{t('common:institutions')}</StyledMenuItemText>
              </StyledLink>
            </StyledMenuItem>
          ),
          user.isInstitutionAdmin && [
            <StyledMenuItem key="menu-admin-institution-button" onClick={closeMenu}>
              <StyledLink to={UrlPathTemplate.MyInstitution} data-testid="menu-admin-institution-button">
                <StyledMenuItemText>{t('common:my_institution')}</StyledMenuItemText>
              </StyledLink>
            </StyledMenuItem>,
            <StyledMenuItem key="menu-admin-institution-users-button" onClick={closeMenu}>
              <StyledLink to={UrlPathTemplate.MyInstitutionUsers} data-testid="menu-admin-institution-users-button">
                <StyledMenuItemText>{t('common:users')}</StyledMenuItemText>
              </StyledLink>
            </StyledMenuItem>,
          ],
          <Divider key="divider" />,
        ]}
        <StyledMenuItem onClick={closeMenu}>
          <StyledLink to={UrlPathTemplate.MyProfile} data-testid="menu-user-profile-button">
            <StyledMenuItemText>{t('profile:my_profile')}</StyledMenuItemText>
          </StyledLink>
        </StyledMenuItem>

        <StyledMenuItem onClick={handleLogout} data-testid="menu-logout-button">
          <StyledMenuItemText>{t('authorization:logout')}</StyledMenuItemText>
        </StyledMenuItem>
      </MuiMenu>
    </StyledMenu>
  );
};
