import React, { useState, MouseEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Menu as MuiMenu, MenuItem, Typography, IconButton, Divider } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { LanguageSelector } from './LanguageSelector';
import { useIsMobile } from '../../utils/hooks/useIsMobile';
import { dataTestId } from '../../utils/dataTestIds';

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
        data-testid={dataTestId.header.menuButton}
        onClick={handleClickMenuAnchor}
        endIcon={anchorEl ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}>
        <Typography noWrap>{menuButtonLabel}</Typography>
      </StyledMenuButton>
      <StyledMobileMenuButton onClick={handleClickMenuAnchor} title={menuButtonLabel}>
        <AccountCircle />
      </StyledMobileMenuButton>
      <MuiMenu
        anchorEl={anchorEl}
        container={divRef.current}
        keepMounted
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        {isMobile && (
          <MenuItem divider>
            <LanguageSelector />
          </MenuItem>
        )}

        {user?.isCurator && (
          <MenuItem
            data-testid={dataTestId.header.worklistLink}
            onClick={closeMenu}
            divider
            component={StyledLink}
            to={UrlPathTemplate.Worklist}>
            <Typography>{t('workLists:my_worklist')}</Typography>
          </MenuItem>
        )}
        {(user?.isAppAdmin || user?.isInstitutionAdmin) && [
          user.isAppAdmin && (
            <MenuItem
              key={dataTestId.header.adminInstitutionsLink}
              data-testid={dataTestId.header.adminInstitutionsLink}
              onClick={closeMenu}
              component={StyledLink}
              to={UrlPathTemplate.AdminInstitutions}>
              <Typography>{t('common:institutions')}</Typography>
            </MenuItem>
          ),
          user.isInstitutionAdmin && [
            <MenuItem
              key={dataTestId.header.adminInstitutionLink}
              data-testid={dataTestId.header.adminInstitutionLink}
              onClick={closeMenu}
              component={StyledLink}
              to={UrlPathTemplate.MyInstitution}>
              <Typography>{t('common:my_institution')}</Typography>
            </MenuItem>,
            <MenuItem
              key={dataTestId.header.adminUsersLink}
              data-testid={dataTestId.header.adminUsersLink}
              onClick={closeMenu}
              component={StyledLink}
              to={UrlPathTemplate.MyInstitutionUsers}>
              <Typography>{t('common:users')}</Typography>
            </MenuItem>,
          ],
          <Divider key="divider" />,
        ]}
        <MenuItem
          data-testid={dataTestId.header.myProfileLink}
          onClick={closeMenu}
          component={StyledLink}
          to={UrlPathTemplate.MyProfile}>
          <Typography>{t('profile:my_profile')}</Typography>
        </MenuItem>

        <MenuItem data-testid={dataTestId.header.logOutLink} onClick={handleLogout}>
          {t('authorization:logout')}
        </MenuItem>
      </MuiMenu>
    </StyledMenu>
  );
};
