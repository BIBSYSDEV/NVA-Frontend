import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DoiRequestConversation,
  MessageType,
  PublicationConversation,
} from '../../types/publication_types/messages.types';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';
import { SupportRequestAccordion } from './SupportRequestAccordion';

interface MessagesOverviewProps {
  conversations: (PublicationConversation | DoiRequestConversation)[];
}

export const MessagesOverview = ({ conversations }: MessagesOverviewProps) => {
  const { t } = useTranslation('workLists');

  useEffect(() => {
    if (conversations.some(({ publication }) => stringIncludesMathJax(publication.mainTitle))) {
      typesetMathJax();
    }
  }, [conversations]);
  return conversations.length === 0 ? (
    <Typography>{t('no_messages')}</Typography>
  ) : (
    <>
      {conversations.map((conversation) => {
        if (conversation.type === 'PublicationConversation') {
          const support = conversation as PublicationConversation;
          return (
            <SupportRequestAccordion
              key={support.messageCollections[0].messages[0].date}
              registration={conversation.publication}
              messageType={MessageType.Support}
              messages={support.messageCollections[0].messages}
            />
          );
        } else if (conversation.type === 'DoiRequest') {
          const doiRequest = conversation as DoiRequestConversation;
          return (
            <SupportRequestAccordion
              key={doiRequest.createdDate}
              registration={conversation.publication}
              messageType={MessageType.DoiRequest}
              messages={doiRequest.messages?.messages ?? []}
            />
          );
        } else {
          return null;
        }
      })}
    </>
  );
};
