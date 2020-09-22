import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getAllCustomerInstitutions } from '../../api/customerInstitutionsApi';
import Card from '../../components/Card';
import { Button, CircularProgress } from '@material-ui/core';
import InstitutionList from './InstitutionList';
import { Link as RouterLink } from 'react-router-dom';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { StyledProgressWrapper, StyledRightAlignedButtonWrapper } from '../../components/styled/Wrappers';
import { PageHeader } from '../../components/PageHeader';

const AdminCustomerInstitutions: FC = () => {
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
    <>
      <PageHeader>{t('admin_institutions')}</PageHeader>
      <Card>
        <StyledRightAlignedButtonWrapper>
          <Button
            color="primary"
            component={RouterLink}
            to="/admin-institutions/new"
            data-testid="add-institution-button">
            {t('add_institution')}
          </Button>
        </StyledRightAlignedButtonWrapper>
        {isLoading ? (
          <StyledProgressWrapper>
            <CircularProgress />
          </StyledProgressWrapper>
        ) : (
          <InstitutionList institutions={institutions} />
        )}
      </Card>
    </>
  );
};

export default AdminCustomerInstitutions;
