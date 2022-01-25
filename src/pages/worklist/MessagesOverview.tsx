import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PublicationConversation } from '../../types/publication_types/messages.types';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';
import { SupportRequestAccordion } from './SupportRequestAccordion';

interface MessagesOverviewProps {
  conversations: PublicationConversation[];
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
      {conversations.map((conversation) =>
        conversation.messageCollections.map((messageCollection) => (
          <SupportRequestAccordion
            key={messageCollection.messages[0].identifier}
            registration={conversation.publication}
            messageCollection={messageCollection}
          />
        ))
      )}
    </>
  );
};
