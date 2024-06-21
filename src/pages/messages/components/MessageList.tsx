import { Box, Divider, Skeleton, Tooltip, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchUser } from '../../../api/roleApi';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { RootState } from '../../../redux/store';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { toDateString } from '../../../utils/date-helpers';
import { getFullName } from '../../../utils/user-helpers';
import { MessageMenu } from './MessageMenu';
import { ticketColor } from './TicketListItem';

interface MessageListProps {
  ticket: Ticket;
  refetchData?: () => void;
  canDeleteMessage?: boolean;
}

export const TicketMessageList = ({ ticket, refetchData, canDeleteMessage }: MessageListProps) => {
  const messages = ticket.messages ?? [];
  const user = useSelector((store: RootState) => store.user);

  return (
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
          <MessageItem
            key={message.identifier}
            text={message.text}
            date={message.createdDate}
            username={message.sender}
            backgroundColor={ticketColor[ticket.type]}
            menuElement={
              !!user &&
              (canDeleteMessage || user.nvaUsername === message.sender) && (
                <MessageMenu
                  ticketId={ticket.id}
                  refetchData={refetchData}
                  canDeleteMessage={!!message.text}
                  messageIdentifier={message.identifier}
                />
              )
            }
          />
        ))}
      </Box>
    </ErrorBoundary>
  );
};

interface MessageItemProps {
  text: ReactNode;
  date: string;
  username: string;
  backgroundColor: string;
  menuElement?: ReactNode;
}

export const MessageItem = ({ text, date, username, backgroundColor, menuElement }: MessageItemProps) => {
  const { t } = useTranslation();

  const senderQuery = useQuery({
    queryKey: [username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: t('feedback.error.get_person') },
  });

  const senderName = getFullName(senderQuery.data?.givenName, senderQuery.data?.familyName);

  return (
    <Box
      component="li"
      sx={{
        bgcolor: backgroundColor,
        p: '0.5rem',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center' }}>
        <Tooltip title={senderName ? senderName : t('common.unknown')}>
          <Typography
            data-testid={dataTestId.registrationLandingPage.tasksPanel.messageSender}
            sx={{
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}>
            {senderQuery.isPending ? (
              <Skeleton sx={{ width: '8rem' }} />
            ) : senderName ? (
              senderName
            ) : (
              <i>{t('common.unknown')}</i>
            )}
          </Typography>
        </Tooltip>
        <Typography data-testid={dataTestId.registrationLandingPage.tasksPanel.messageTimestamp}>
          {toDateString(date)}
        </Typography>
        {menuElement}
      </Box>

      <Divider sx={{ mb: '0.5rem', bgcolor: 'primary.main' }} />

      <Box
        data-testid={dataTestId.registrationLandingPage.tasksPanel.messageText}
        component={typeof text === 'string' ? Typography : 'div'}>
        {text ? text : <i>{t('my_page.messages.message_deleted')}</i>}
      </Box>
    </Box>
  );
};
