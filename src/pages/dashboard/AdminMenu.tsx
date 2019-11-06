import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { RootStore } from '../../redux/reducers/rootReducer';
import { BOX_COLOR } from '../../themes/mainTheme';

const StyledAdminMenu = styled.div`
  background-color: ${BOX_COLOR};
  width: 100%;
  display: flex;
  align-items: center;
  min-height: 4rem;
`;

const StyledHeader = styled.div`
  font-size: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
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
          <StyledHeader>{t('Admin panel')}</StyledHeader>
          <Link to="/resources/new">
            <StyledButton color="primary" variant="contained">
              {t('New registration')}
            </StyledButton>
          </Link>
        </StyledAdminMenu>
      )}
    </>
  );
};

export default AdminMenu;
