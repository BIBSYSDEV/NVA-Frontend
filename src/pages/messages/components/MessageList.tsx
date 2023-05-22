import { Box, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Message } from '../../../types/publication_types/ticket.types';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { fetchUser } from '../../../api/roleApi';
import { getFullName } from '../../../utils/user-helpers';
import { setNotification } from '../../../redux/notificationSlice';
import { dataTestId } from '../../../utils/dataTestIds';

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => (
  <ErrorBoundary>
    <Box
      component="ul"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        listStyleType: 'none',
        p: 0,
        m: 0,
        gap: '0.25rem',
      }}>
      {messages.map((message) => (
        <MessageItem key={message.identifier} message={message} />
      ))}
    </Box>
  </ErrorBoundary>
);

interface MessageItemProps {
  message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const senderQuery = useQuery({
    queryKey: [message.sender],
    queryFn: () => fetchUser(message.sender),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_person'), variant: 'error' })),
  });

  const senderName = getFullName(senderQuery.data?.givenName, senderQuery.data?.familyName);

  return (
    <li>
      <Typography sx={{ display: 'flex', gap: '0.25rem' }}>
        <span>
          {senderQuery.isLoading ? (
            <Skeleton sx={{ width: '8rem' }} />
          ) : (
            <b data-testid={dataTestId.registrationLandingPage.tasksPanel.messageSender}>{senderName}</b>
          )}
        </span>
        <span data-testid={dataTestId.registrationLandingPage.tasksPanel.messageTimestamp}>
          ({new Date(message.createdDate).toLocaleString()})
        </span>
      </Typography>

      <Typography data-testid={dataTestId.registrationLandingPage.tasksPanel.messageText}>{message.text}</Typography>
    </li>
  );
};
