import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { AppBar, Button, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import { RootStore } from '../../redux/reducers/rootReducer';
import { getRegistrationPath, UrlPathTemplate } from '../../utils/urlPaths';
import { Login } from './Login';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';

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

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <AppBar position="static" color="inherit" elevation={0}>
      <StyledNav>
        {user && (
          <>
            <StyledBurgerMenu>
              <IconButton onClick={handleClick}>
                <MenuIcon />
              </IconButton>
            </StyledBurgerMenu>
            <MobileMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
          </>
        )}
        <Logo />
        {user?.isCreator && (
          <StyledShortcuts>
            <Button
              component={RouterLink}
              data-testid="new-registration"
              to={getRegistrationPath()}
              startIcon={<AddIcon />}>
              {t('new_registration')}
            </Button>
            <Button
              component={RouterLink}
              data-testid="my-registrations"
              to={UrlPathTemplate.MyRegistrations}
              startIcon={<LibraryBooksIcon />}>
              {t('workLists:my_registrations')}
            </Button>
            <Button
              component={RouterLink}
              data-testid="my-messages"
              to={UrlPathTemplate.MyMessages}
              startIcon={<MailIcon />}>
              {t('workLists:my_messages')}
            </Button>
          </StyledShortcuts>
        )}
        <Login />
      </StyledNav>
    </AppBar>
  );
};
