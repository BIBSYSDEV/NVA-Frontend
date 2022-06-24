import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PublicationConversation } from '../../types/publication_types/messages.types';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';
import { SupportRequestAccordion } from './SupportRequestAccordion';

interface MyMessagesProps {
  conversations: PublicationConversation[];
}

export const MyMessages = ({ conversations }: MyMessagesProps) => {
  const { t } = useTranslation('myPage');
  useEffect(() => {
    if (conversations.some(({ publication }) => stringIncludesMathJax(publication.mainTitle))) {
      typesetMathJax();
    }
  }, [conversations]);

  return conversations.length === 0 ? (
    <Typography>{t('messages.no_messages')}</Typography>
  ) : (
    <>
      {conversations.map((conversation) =>
        conversation.messageCollections.map((messageCollection) => (
          <SupportRequestAccordion
            key={messageCollection.messages[0].identifier}
            registration={conversation.publication}
            messageType={messageCollection.messageType}
            messages={messageCollection.messages}
          />
        ))
      )}
    </>
  );
};
