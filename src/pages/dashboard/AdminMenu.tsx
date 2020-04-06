import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { RootStore } from '../../redux/reducers/rootReducer';

const StyledAdminMenu = styled.div`
  background-color: ${({ theme }) => theme.palette.box.main};
  width: 100%;
  display: flex;
  align-items: center;
  min-height: 4rem;
`;

const StyledButtonWrapper = styled.div`
  margin-left: 1rem;
  margin-right: 1rem;
`;

const AdminMenu: FC = () => {
  const user = useSelector((state: RootStore) => state.user);
  const history = useHistory();
  const { t } = useTranslation('publication');

  return user.isPublisher ? (
    <>
      {history.location.pathname !== '/publication' && (
        <StyledAdminMenu>
          <StyledButtonWrapper>
            <Button component={RouterLink} to="/publication" color="primary" data-testid="new-publication-button">
              + {t('new_publication')}
            </Button>
          </StyledButtonWrapper>
        </StyledAdminMenu>
      )}
    </>
  ) : null;
};

export default AdminMenu;
