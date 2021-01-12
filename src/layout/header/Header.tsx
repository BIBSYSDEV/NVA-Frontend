import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Typography, IconButton, AppBar } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Login from './Login';
import Logo from './Logo';
import { RootStore } from '../../redux/reducers/rootReducer';
import MobileMenu from './MobileMenu';
import { getRegistrationPath, UrlPathTemplate } from '../../utils/urlPaths';

const StyledAppBar = styled(AppBar)`
  display: grid;
  grid-template-areas: 'logo shortcuts auth';
  grid-template-columns: 5rem auto auto;
  align-items: center;
  padding-left: 5%;
  padding-right: 5%;
  min-height: 4rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-areas: 'menu logo auth';
    padding-left: 1rem;
    padding-right: 1rem;
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

const Header = () => {
  const { t } = useTranslation('registration');
  const user = useSelector((store: RootStore) => store.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <StyledAppBar position="static" color="inherit">
      <StyledBurgerMenu>
        <IconButton onClick={handleClick}>
          <MenuIcon />
        </IconButton>
      </StyledBurgerMenu>
      <MobileMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
      <Logo />
      {user?.isCreator && (
        <StyledShortcuts>
          <Button
            color="primary"
            component={RouterLink}
            data-testid="new-registration"
            to={getRegistrationPath()}
            startIcon={<AddIcon />}>
            <Typography variant="button">{t('new_registration')}</Typography>
          </Button>
          <Button
            color="primary"
            component={RouterLink}
            data-testid="my-registrations"
            to={UrlPathTemplate.MyRegistrations}
            startIcon={<LibraryBooksIcon />}>
            <Typography variant="button">{t('workLists:my_registrations')}</Typography>
          </Button>
          <Button
            color="primary"
            component={RouterLink}
            data-testid="my-messages"
            to={UrlPathTemplate.MyMessages}
            startIcon={<MailIcon />}>
            <Typography variant="button">{t('workLists:my_messages')}</Typography>
          </Button>
        </StyledShortcuts>
      )}
      <Login />
    </StyledAppBar>
  );
};

export default Header;
