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
  const [messages, isLoadingMessages, refetchMessages] = useFetchMessages(role);

  return (
    <>
      {isLoadingMessages && messages.length === 0 ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : messages.length === 0 ? (
        <Typography>{t('no_messages')}</Typography>
      ) : (
        <>
          {messages.map((message) => (
            <MessageAccordion
              key={message.publication.identifier}
              message={message}
              refetchMessages={refetchMessages}
            />
          ))}
        </>
      )}
    </>
  );
};
