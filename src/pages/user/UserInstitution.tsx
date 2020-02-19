import React, { useState, useEffect, FC } from 'react';
import Card from '../../components/Card';
import InstitutionCard from './institution/InstitutionCard';
import { Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootStore } from './../../redux/reducers/rootReducer';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import InstitutionSelector from './institution/InstitutionSelector';
import Heading from '../../components/Heading';

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const UserInstitution: FC = () => {
  // Create Formik Form here App.tsx
  const user = useSelector((state: RootStore) => state.user);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('profile');

  const handleClickAdd = () => {
    setOpen(true);
  };

  return (
    <Card>
      <Heading>{t('heading.organizations')}</Heading>
      <InstitutionCard />
      {open && <InstitutionSelector unit={{ name: 'NTNU', id: '1', subunits: [] }} counter={0} />}
      <StyledButtonContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickAdd}
          disabled={!user.authority?.systemControlNumber}
          data-testid="add-new-institution-button">
          {t('organization.add_institution')}
        </Button>
      </StyledButtonContainer>
    </Card>
  );
};

export default UserInstitution;
