import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Link as MuiLink } from '@material-ui/core';

import { RootStore } from '../../redux/reducers/rootReducer';

const StyledAdminMenu = styled.div`
  background-color: ${({ theme }) => theme.palette.box.main};
  width: 100%;
  display: flex;
  align-items: center;
  min-height: 4rem;
`;

const StyledButton = styled(Button)`
  margin-left: 1rem;
  margin-right: 1rem;
`;

const AdminMenu: React.FC = () => {
  const user = useSelector((state: RootStore) => state.user);
  const { t } = useTranslation();

  return (
    <>
      {user.id && (
        <StyledAdminMenu>
          <MuiLink component={Link} to="/publications/new">
            <StyledButton color="primary" variant="contained" data-testid="new-publication-button">
              + {t('new_publication')}
            </StyledButton>
          </MuiLink>
        </StyledAdminMenu>
      )}
    </>
  );
};

export default AdminMenu;
