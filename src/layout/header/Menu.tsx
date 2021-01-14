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

const StyledPaddedTypography = styled(Typography)`
  padding: 0 1rem;
`;

const StyledHeaderTypography = styled(StyledPaddedTypography)`
  font-weight: bold;
  margin-top: 0.5rem;
  text-transform: uppercase;
`;

const StyledIndentedTypography = styled(StyledPaddedTypography)`
  padding-left: 1.5rem;
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

const Menu = ({ menuButtonLabel, handleLogout }: MenuProps) => {
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
        disableFocusRipple
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
        {user?.isCurator && [
          <StyledHeaderTypography key="1">{t('profile:roles.curator')}</StyledHeaderTypography>,
          <MenuItem
            key="menu-my-worklist-button"
            data-testid="menu-my-worklist-button"
            component={Link}
            to={UrlPathTemplate.Worklist}
            onClick={closeMenu}
            disableGutters>
            <StyledIndentedTypography>{t('workLists:my_worklist')}</StyledIndentedTypography>
          </MenuItem>,
          <Divider key="divider1" />,
        ]}
        {(user?.isAppAdmin || user?.isInstitutionAdmin) && [
          <StyledHeaderTypography key="4">{t('common:admin')}</StyledHeaderTypography>,
          user.isAppAdmin && (
            <MenuItem
              key="menu-admin-institutions-button"
              data-testid="menu-admin-institutions-button"
              component={Link}
              to={UrlPathTemplate.AdminInstitutions}
              onClick={closeMenu}
              disableGutters>
              <StyledIndentedTypography>{t('common:institutions')}</StyledIndentedTypography>
            </MenuItem>
          ),
          user.isInstitutionAdmin && [
            <MenuItem
              key="menu-admin-institution-button"
              data-testid="menu-admin-institution-button"
              component={Link}
              to={UrlPathTemplate.MyInstitution}
              onClick={closeMenu}
              disableGutters>
              <StyledIndentedTypography>{t('common:my_institution')}</StyledIndentedTypography>
            </MenuItem>,
            <MenuItem
              key="menu-admin-institution-users-button"
              data-testid="menu-admin-institution-users-button"
              component={Link}
              to={UrlPathTemplate.MyInstitutionUsers}
              onClick={closeMenu}
              disableGutters>
              <StyledIndentedTypography>{t('common:users')}</StyledIndentedTypography>
            </MenuItem>,
          ],
          <Divider key="divider2" />,
        ]}
        <MenuItem
          component={Link}
          to={UrlPathTemplate.MyProfile}
          data-testid="menu-user-profile-button"
          onClick={closeMenu}
          disableGutters>
          <StyledPaddedTypography>{t('profile:my_profile')}</StyledPaddedTypography>
        </MenuItem>

        <MenuItem onClick={handleLogout} data-testid="menu-logout-button" disableGutters>
          <StyledPaddedTypography>{t('authorization:logout')}</StyledPaddedTypography>
        </MenuItem>
      </MuiMenu>
    </StyledMenu>
  );
};

export default Menu;
