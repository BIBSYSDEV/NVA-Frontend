import React, { useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { AppBar, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import { RootStore } from '../../redux/reducers/rootReducer';
import { getRegistrationPath, UrlPathTemplate } from '../../utils/urlPaths';
import { Login } from './Login';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { LanguageSelector } from './LanguageSelector';
import { useIsMobile } from '../../utils/hooks/useIsMobile';

const StyledNav = styled.nav`
  display: grid;
  grid-template-areas: 'logo shortcuts auth';
  grid-template-columns: 5rem auto auto;
  align-items: center;
  padding: 0 1rem;
  min-height: 4rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-areas: 'menu logo auth';
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const StyledShortcuts = styled.div`
  grid-area: shortcuts;
  > * {
    margin-left: 2rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    display: none;
  }
`;

const StyledAuth = styled.div`
  grid-area: auth;
  justify-self: right;
  display: flex;
  > :nth-child(2) {
    margin-left: 1rem;
  }
`;

const StyledBurgerMenu = styled.div`
  grid-area: menu;
  justify-self: left;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    display: none;
  }
`;

export const Header = () => {
  const { t } = useTranslation('registration');
  const user = useSelector((store: RootStore) => store.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMobile = useIsMobile();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <AppBar position="static" elevation={0}>
      <StyledNav>
        {user && (
          <StyledBurgerMenu>
            <IconButton onClick={handleClick} title={t('common:menu')} size="large">
              <MenuIcon />
            </IconButton>
            <MobileMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
          </StyledBurgerMenu>
        )}
        <Logo />
        {user?.isCreator && (
          <StyledShortcuts>
            <Button
              color="inherit"
              component={RouterLink}
              data-testid="new-registration"
              to={getRegistrationPath()}
              startIcon={<AddIcon />}>
              {t('new_registration')}
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              data-testid="my-registrations"
              to={UrlPathTemplate.MyRegistrations}
              startIcon={<LibraryBooksIcon />}>
              {t('workLists:my_registrations')}
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              data-testid="my-messages"
              to={UrlPathTemplate.MyMessages}
              startIcon={<MailIcon />}>
              {t('workLists:my_messages')}
            </Button>
          </StyledShortcuts>
        )}
        <StyledAuth>
          {!isMobile && <LanguageSelector />}
          <Login />
        </StyledAuth>
      </StyledNav>
    </AppBar>
  );
};
