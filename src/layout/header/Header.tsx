import React, { FC, useState } from 'react';
import Login from './Login';
import Logo from './Logo';
import styled from 'styled-components';
import { Button, Typography, IconButton } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import AddIcon from '@material-ui/icons/Add';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import MenuIcon from '@material-ui/icons/Menu';
import MobileMenu from './MobileMenu';

const StyledPageHeader = styled.div`
  display: grid;
  grid-template-areas: 'logo shortcuts auth';
  grid-template-columns: 5rem auto auto;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.palette.separator.main};
  min-height: 4rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'menu logo auth';
    grid-template-columns: 1fr 1fr 1fr;
    padding: 0;
  }
`;

const StyledShortcuts = styled.div`
  grid-area: shortcuts;
  > * {
    margin-left: 2rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: none;
  }
`;

const StyledBurgerMenu = styled.div`
  grid-area: menu;
  justify-self: left;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: none;
  }
`;

const Header: FC = () => {
  const { t } = useTranslation('publication');
  const user = useSelector((store: RootStore) => store.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <StyledPageHeader>
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
            data-testid="new-publication"
            to="/publication"
            startIcon={<AddIcon />}>
            <Typography variant="button">{t('new_registration')}</Typography>
          </Button>
          <Button
            color="primary"
            component={RouterLink}
            data-testid="my-publications"
            to="/my-publications"
            startIcon={<LibraryBooks />}>
            <Typography variant="button">{t('workLists:my_registrations')}</Typography>
          </Button>
        </StyledShortcuts>
      )}
      <Login />
    </StyledPageHeader>
  );
};

export default Header;
