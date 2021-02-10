import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Button, CircularProgress } from '@material-ui/core';
import { getAllCustomerInstitutions } from '../../api/customerInstitutionsApi';
import BackgroundDiv from '../../components/BackgroundDiv';
import Card from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { StyledProgressWrapper, StyledRightAlignedWrapper } from '../../components/styled/Wrappers';
import { setNotification } from '../../redux/actions/notificationActions';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { NotificationVariant } from '../../types/notification.types';
import { getAdminInstitutionPath } from '../../utils/urlPaths';
import InstitutionList from './InstitutionList';

const AdminCustomerInstitutions: FC = () => {
  const { t } = useTranslation('admin');
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [institutions, setInstitutions] = useState<CustomerInstitution[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const institutions = await getAllCustomerInstitutions();
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
    <BackgroundDiv>
      <PageHeader>{t('admin_institutions')}</PageHeader>
      <Card>
        <StyledRightAlignedWrapper>
          <Button
            color="primary"
            component={RouterLink}
            to={getAdminInstitutionPath('new')}
            data-testid="add-institution-button">
            {t('add_institution')}
          </Button>
        </StyledRightAlignedWrapper>
        {isLoading ? (
          <StyledProgressWrapper>
            <CircularProgress />
          </StyledProgressWrapper>
        ) : (
          <InstitutionList institutions={institutions} />
        )}
      </Card>
    </BackgroundDiv>
  );
};

export default AdminCustomerInstitutions;
