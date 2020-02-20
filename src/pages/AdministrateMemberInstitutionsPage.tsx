import React, { FC, useEffect, useState } from 'react';
import Heading from '../components/Heading';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { addNotification } from '../redux/actions/notificationActions';
import i18n from '../translations/i18n';
import { getAllMemberInstitutions } from '../api/memberInstitutionsApi';
import Card from '../components/Card';
import { CircularProgress } from '@material-ui/core';
import InstitutionList from './InstitutionList';

export interface MemberInstitutions {
  name: string;
  id: string;
  createdDate: string;
  contact: string;
}

const AdministrateMemberInstututionPage: FC = () => {
  const { t } = useTranslation('admin');
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [institutions, setInstitutions] = useState<MemberInstitutions[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const institutions = await getAllMemberInstitutions();
      if (institutions?.error) {
        dispatch(addNotification(i18n.t('feedback:error.get_publications'), 'error'));
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
      {isLoading ? <CircularProgress color="inherit" size={20} /> : <InstitutionList institutions={institutions} />}
    </Card>
  );
};

export default AdministrateMemberInstututionPage;
