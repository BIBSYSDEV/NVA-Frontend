import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
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

const AdminMenu: FC = () => {
  const user = useSelector((state: RootStore) => state.user);
  const [showNewRegistrationButton, setShowNewRegistrationButton] = useState(false);
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    setShowNewRegistrationButton(history.location.pathname !== '/publications/new');
  }, [history.location.pathname]);

  return (
    <>
      {user.id && showNewRegistrationButton && (
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
