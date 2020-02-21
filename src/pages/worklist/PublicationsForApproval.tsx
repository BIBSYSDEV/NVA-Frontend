import React, { FC, useState, useEffect } from 'react';
import { getPublicationsForApproval } from '../../api/publicationApi';
import WorklistTable from './WorkListTable';
import { useTranslation } from 'react-i18next';
import Progress from '../../components/Progress';
import SubHeading from '../../components/SubHeading';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../redux/actions/notificationActions';

const PublicationsForApproval: FC = () => {
  const { t } = useTranslation('workLists');
  const [publicationsForApproval, setPublicationsForApproval] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPublicationsForApproval = async () => {
      const publicationsForApprovalResponse = await getPublicationsForApproval();
      if (publicationsForApprovalResponse.error) {
        dispatch(addNotification(t('feedback:error.get_approvable_publications'), 'error'));
      } else {
        setPublicationsForApproval(publicationsForApprovalResponse);
      }
      setIsLoading(false);
    };
    fetchPublicationsForApproval();
  }, [dispatch, t]);

  return isLoading ? (
    <Progress />
  ) : publicationsForApproval.length > 0 ? (
    <WorklistTable publications={publicationsForApproval} />
  ) : (
    <SubHeading>{t('no_pending_publications')}</SubHeading>
  );
};

export default PublicationsForApproval;
