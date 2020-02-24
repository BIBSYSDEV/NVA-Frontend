import React, { FC, useEffect, useState } from 'react';
import Heading from '../components/Heading';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getAllCustomerInstitutions } from '../api/customerInstitutionsApi';
import Card from '../components/Card';
import { CircularProgress } from '@material-ui/core';
import InstitutionList from './InstitutionList';

export interface DummyCustomerInstitution {
  name: string;
  id: string;
  createdDate: string;
  contact: string;
}

const AdminCustomerInstututionPage: FC = () => {
  const { t } = useTranslation('admin');
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [institutions, setInstitutions] = useState<DummyCustomerInstitution[]>([]);

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
      {isLoading ? <CircularProgress color="inherit" size={20} /> : <InstitutionList institutions={institutions} />}
    </Card>
  );
};

export default AdminCustomerInstututionPage;
