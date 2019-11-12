import React, { useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@material-ui/core';

import { addContributor, resetContributors } from '../../redux/actions/contributorActions';
import { contributorReducer } from '../../redux/reducers/contributorReducer';
import { RootStore } from '../../redux/reducers/rootReducer';
import { useMockData } from '../../utils/constants';
import mockContributors from '../../utils/testfiles/contributors.json';

const StyledAdminMenu = styled.div`
  background-color: ${({ theme }) => theme.palette.box.main};
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

  const [contributors, dispatch] = useReducer(contributorReducer, []);

  return (
    <>
      {user.id && (
        <StyledAdminMenu>
          <StyledHeader>{t('Admin panel')}</StyledHeader>
          <Link to="/resources/new">
            <StyledButton
              color="primary"
              variant="contained"
              onClick={() => {
                if (useMockData) {
                  dispatch(resetContributors());
                  mockContributors.forEach(contributor => dispatch(addContributor(contributor)));
                }
              }}>
              {t('New registration')}
            </StyledButton>
          </Link>
        </StyledAdminMenu>
      )}
    </>
  );
};

export default AdminMenu;
