import React, { FC, useEffect, useState } from 'react';
import Heading from '../../components/Heading';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getAllCustomerInstitutions } from '../../api/customerInstitutionsApi';
import Card from '../../components/Card';
import { Button, CircularProgress } from '@material-ui/core';
import InstitutionList from './InstitutionList';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { CustomerInstitution } from '../../types/customerInstitution.types';

const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const AdminCustomerInstitutionsPage: FC = () => {
  const { t } = useTranslation('admin');
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [institutions, setInstitutions] = useState<CustomerInstitution[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const institutions = await getAllCustomerInstitutions();
      // if (institutions?.error) {
      //   dispatch(addNotification(t('feedback:error.get_institutions'), 'error'));
      // } else {
      setInstitutions(institutions);
      // }
      setIsLoading(false);
    };
    loadData();
  }, [dispatch]);

  return (
    <Card>
      <Heading>{t('common:institutions')}</Heading>
      <StyledButtonWrapper>
        <Button color="primary" component={RouterLink} to={`/admin-institution`} data-testid="add-institution-button">
          {t('add_institution')}
        </Button>
      </StyledButtonWrapper>
      {isLoading ? <CircularProgress color="inherit" size={20} /> : <InstitutionList institutions={institutions} />}
    </Card>
  );
};

export default AdminCustomerInstitutionsPage;
