import React, { FC, useState, useEffect } from 'react';
import { getDoiRequests } from '../../api/publicationApi';
import WorklistTable from './WorkListTable';
import { useTranslation } from 'react-i18next';
import SubHeading from '../../components/SubHeading';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { CircularProgress } from '@material-ui/core';

const DoiRequests: FC = () => {
  const { t } = useTranslation('workLists');
  const [doiRequests, setDoiRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDoiRequests = async () => {
      const doiRequestsResponse = await getDoiRequests();
      if (doiRequestsResponse.error) {
        dispatch(setNotification(doiRequestsResponse.error, NotificationVariant.Error));
      } else {
        setDoiRequests(doiRequestsResponse);
      }
      setIsLoading(false);
    };
    fetchDoiRequests();
  }, [dispatch]);

  return isLoading ? (
    <CircularProgress />
  ) : doiRequests.length > 0 ? (
    <WorklistTable publications={doiRequests} />
  ) : (
    <SubHeading>{t('no_pending_doi_requests')}</SubHeading>
  );
};

export default DoiRequests;
