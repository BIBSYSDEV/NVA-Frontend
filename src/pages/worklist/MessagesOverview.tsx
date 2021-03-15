import { Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ListSkeleton from '../../components/ListSkeleton';
import { RoleName } from '../../types/user.types';
import { useFetchMessages } from '../../utils/hooks/useFetchMessages';
import { MessageAccordion } from '../worklist/MessageAccordion';

interface MessagesOverviewProps {
  role: RoleName;
}

export const MessagesOverview = ({ role }: MessagesOverviewProps) => {
  const { t } = useTranslation('workLists');
  const [supportRequests, isLoadingMessages, refetchMessages] = useFetchMessages(role);

  return (
    <>
      {isLoadingMessages && supportRequests.length === 0 ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : supportRequests.length === 0 ? (
        <Typography>{t('no_messages')}</Typography>
      ) : (
        <>
          {supportRequests.map((supportRequest) =>
            supportRequest.messageCollections.map((messageCollection) => (
              <MessageAccordion
                key={supportRequest.publication.identifier}
                messageCollection={messageCollection}
                registration={supportRequest.publication}
                refetchMessages={refetchMessages}
              />
            ))
          )}
        </>
      )}
    </>
  );
};
