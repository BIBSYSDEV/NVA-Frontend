import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SupportRequest } from '../../types/publication_types/messages.types';
import { SupportRequestAccordion } from './SupportRequestAccordion';

interface MessagesOverviewProps {
  conversations: SupportRequest[];
  refetch: () => void;
}

export const MessagesOverview = ({ conversations, refetch }: MessagesOverviewProps) => {
  const { t } = useTranslation('workLists');

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
            fetchSupportRequests={refetch}
          />
        ))
      )}
    </>
  );
};
