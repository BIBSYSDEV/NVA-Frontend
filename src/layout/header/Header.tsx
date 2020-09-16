import React, { FC } from 'react';
import Login from './Login';
import Logo from './Logo';
import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import AddIcon from '@material-ui/icons/Add';
import LibraryBooks from '@material-ui/icons/LibraryBooks';

const StyledPageHeader = styled.div`
  display: grid;
  grid-template-areas: 'logo shortcuts auth';
  grid-template-columns: 5rem auto auto;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.palette.separator.main};
  min-height: 4rem;
`;

const StyledShortcuts = styled.div`
  grid-area: shortcuts;
  > * {
    margin-left: 2rem;
  }
`;

const Header: FC = () => {
  const { t } = useTranslation('publication');
  const user = useSelector((store: RootStore) => store.user);

  return (
    <StyledPageHeader>
      <Logo />
      {user?.isCreator && (
        <StyledShortcuts>
          <Button
            color="primary"
            component={RouterLink}
            data-testid="new-publication"
            to="publication"
            startIcon={<AddIcon />}>
            <Typography variant="button">{t('new_publication')}</Typography>
          </Button>
          <Button
            color="primary"
            component={RouterLink}
            data-testid="my-publications"
            to="my-publications"
            startIcon={<LibraryBooks />}>
            <Typography variant="button">{t('workLists:my_publications')}</Typography>
          </Button>
        </StyledShortcuts>
      )}
      <Login />
    </StyledPageHeader>
  );
};

export default Header;
