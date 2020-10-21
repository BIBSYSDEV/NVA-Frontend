import React, { FC, useState, useEffect } from 'react';
import { getPublicationsForApproval } from '../../api/publicationApi';
import WorklistTable from './WorkListTable';
import { useTranslation } from 'react-i18next';
import SubHeading from '../../components/SubHeading';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { CircularProgress } from '@material-ui/core';

const RegistrationsForApproval: FC = () => {
  const { t } = useTranslation('workLists');
  const [publicationsForApproval, setPublicationsForApproval] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPublicationsForApproval = async () => {
      const publicationsForApprovalResponse = await getPublicationsForApproval();
      if (publicationsForApprovalResponse.error) {
        dispatch(setNotification(publicationsForApprovalResponse.error, NotificationVariant.Error));
      } else {
        setPublicationsForApproval(publicationsForApprovalResponse);
      }
      setIsLoading(false);
    };
    fetchPublicationsForApproval();
  }, [dispatch]);

  return isLoading ? (
    <CircularProgress />
  ) : publicationsForApproval.length > 0 ? (
    <WorklistTable publications={publicationsForApproval} />
  ) : (
    <SubHeading>{t('no_pending_registrations')}</SubHeading>
  );
};

export default RegistrationsForApproval;
