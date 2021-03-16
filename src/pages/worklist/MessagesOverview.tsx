import { Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ListSkeleton from '../../components/ListSkeleton';
import { RoleName } from '../../types/user.types';
import { useFetchSupportRequests } from '../../utils/hooks/useFetchSupportRequests';
import { SupportRequestAccordion } from './SupportRequestAccordion';

interface MessagesOverviewProps {
  role: RoleName;
}

export const MessagesOverview = ({ role }: MessagesOverviewProps) => {
  const { t } = useTranslation('workLists');
  const [supportRequests, isLoadingSupportRequests, fetchSupportRequests] = useFetchSupportRequests(role);

  return isLoadingSupportRequests && supportRequests.length === 0 ? (
    <ListSkeleton minWidth={100} maxWidth={100} height={100} />
  ) : supportRequests.length === 0 ? (
    <Typography>{t('no_messages')}</Typography>
  ) : (
    <>
      {supportRequests.map((supportRequest) =>
        supportRequest.messageCollections.map((messageCollection) => (
          <SupportRequestAccordion
            key={messageCollection.messages[0].identifier}
            registration={supportRequest.publication}
            messageCollection={messageCollection}
            fetchSupportRequests={fetchSupportRequests}
          />
        ))
      )}
    </>
  );
};
