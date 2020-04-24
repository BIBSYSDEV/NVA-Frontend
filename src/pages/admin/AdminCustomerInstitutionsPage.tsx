import React, { FC, useEffect, useState } from 'react';
import Heading from '../../components/Heading';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getAllCustomerInstitutions } from '../../api/customerInstitutionsApi';
import Card from '../../components/Card';
import { Button } from '@material-ui/core';
import InstitutionList from './InstitutionList';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import Progress from '../../components/Progress';

const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledProgressContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const AdminCustomerInstitutionsPage: FC = () => {
  const { t } = useTranslation('admin');
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [institutions, setInstitutions] = useState<CustomerInstitution[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const institutions: any = await getAllCustomerInstitutions();
      if (institutions?.error) {
        dispatch(setNotification(institutions.error, NotificationVariant.Error));
      } else {
        setInstitutions(institutions);
      }
      setIsLoading(false);
    };
    loadData();
  }, [dispatch]);

  return (
    <Card>
      <Heading>{t('common:institutions')}</Heading>
      <StyledButtonWrapper>
        <Button
          color="primary"
          component={RouterLink}
          to="/admin-institutions/new"
          data-testid="add-institution-button">
          {t('add_institution')}
        </Button>
      </StyledButtonWrapper>
      {isLoading ? (
        <StyledProgressContainer>
          <Progress />
        </StyledProgressContainer>
      ) : (
        <InstitutionList institutions={institutions} />
      )}
    </Card>
  );
};

export default AdminCustomerInstitutionsPage;
