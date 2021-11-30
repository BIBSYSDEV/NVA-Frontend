import { useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { AppBar, Button, Divider, IconButton, Theme, useMediaQuery } from '@mui/material';
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

const StyledNav = styled.nav`
  display: grid;
  grid-template-areas: 'menu logo new-result user-items';
  grid-template-columns: 1fr 1fr 10fr 3fr;
  gap: 1rem;
  align-items: center;
  padding: 0 1rem;
`;

const StyledShortcuts = styled.div`
  align-self: center;
  grid-area: new-result;
  > * {
    margin-left: 2rem;
  }
`;

const StyledAuth = styled.div`
  grid-area: user-items;
  display: flex;
  gap: 1rem;
`;

const StyledBurgerMenu = styled.div`
  grid-area: menu;
  justify-self: left;
`;

export const Header = () => {
  const { t } = useTranslation('registration');
  const user = useSelector((store: RootStore) => store.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <AppBar position="static" elevation={0} sx={{ color: 'white' }}>
      <StyledNav>
        <StyledBurgerMenu>
          <IconButton onClick={handleClick} title={t('common:menu')} size="large" sx={{ color: 'white' }}>
            <MenuIcon fontSize="large" />
          </IconButton>
          <MobileMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
        </StyledBurgerMenu>

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
          <Divider sx={{ gridArea: 'divider', borderColor: 'white', opacity: 0.8 }} orientation="vertical" flexItem />
          {!isMobile && <LanguageSelector />}
          <Login />
        </StyledAuth>
      </StyledNav>
    </AppBar>
  );
};
