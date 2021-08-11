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
import { LanguageSelector } from './LanguageSelector';
import { useIsMobile } from '../../utils/hooks/useIsMobile';

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

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
  height: 100%;
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
  const isMobile = useIsMobile();

  const handleClickMenuAnchor = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  return (
    <StyledMenu ref={divRef}>
      <StyledMenuButton
        onClick={handleClickMenuAnchor}
        data-testid="menu"
        endIcon={anchorEl ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}>
        <Typography noWrap>{menuButtonLabel}</Typography>
      </StyledMenuButton>
      <StyledMobileMenuButton onClick={handleClickMenuAnchor} title={menuButtonLabel}>
        <AccountCircle />
      </StyledMobileMenuButton>
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
        {isMobile && (
          <MenuItem key="language-selector" divider>
            <LanguageSelector />
          </MenuItem>
        )}

        {user?.isCurator && (
          <MenuItem key="menu-my-worklist-button" onClick={closeMenu} divider>
            <StyledLink to={UrlPathTemplate.Worklist} data-testid="menu-my-worklist-button">
              <Typography>{t('workLists:my_worklist')}</Typography>
            </StyledLink>
          </MenuItem>
        )}
        {(user?.isAppAdmin || user?.isInstitutionAdmin) && [
          user.isAppAdmin && (
            <MenuItem key="menu-admin-institutions-button" onClick={closeMenu}>
              <StyledLink to={UrlPathTemplate.AdminInstitutions} data-testid="menu-admin-institutions-button">
                <Typography>{t('common:institutions')}</Typography>
              </StyledLink>
            </MenuItem>
          ),
          user.isInstitutionAdmin && [
            <MenuItem key="menu-admin-institution-button" onClick={closeMenu}>
              <StyledLink to={UrlPathTemplate.MyInstitution} data-testid="menu-admin-institution-button">
                <Typography>{t('common:my_institution')}</Typography>
              </StyledLink>
            </MenuItem>,
            <MenuItem key="menu-admin-institution-users-button" onClick={closeMenu}>
              <StyledLink to={UrlPathTemplate.MyInstitutionUsers} data-testid="menu-admin-institution-users-button">
                <Typography>{t('common:users')}</Typography>
              </StyledLink>
            </MenuItem>,
          ],
          <Divider key="divider" />,
        ]}
        <MenuItem onClick={closeMenu}>
          <StyledLink to={UrlPathTemplate.MyProfile} data-testid="menu-user-profile-button">
            <Typography>{t('profile:my_profile')}</Typography>
          </StyledLink>
        </MenuItem>

        <MenuItem onClick={handleLogout} data-testid="menu-logout-button">
          {t('authorization:logout')}
        </MenuItem>
      </MuiMenu>
    </StyledMenu>
  );
};
