import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Link as MuiLink } from '@material-ui/core';

import { RootStore } from '../../redux/reducers/rootReducer';
import { checkIfPublisher } from '../../utils/authorization';

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

const AdminMenu: FC = () => {
  const user = useSelector((state: RootStore) => state.user);
  const history = useHistory();
  const { t } = useTranslation();

  const isPublisher = checkIfPublisher(user);

  return isPublisher ? (
    <>
      {history.location.pathname !== '/publication' && (
        <StyledAdminMenu>
          <MuiLink component={Link} to="/publication">
            <StyledButton color="primary" variant="contained" data-testid="new-publication-button">
              + {t('new_publication')}
            </StyledButton>
          </MuiLink>
        </StyledAdminMenu>
      )}
    </>
  ) : null;
};

export default AdminMenu;
