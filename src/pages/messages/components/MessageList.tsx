import { Box, BoxProps, Divider, Skeleton, Tooltip, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchUserQuery } from '../../../api/hooks/useFetchUserQuery';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { StyledTruncatableTypography } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { toDateString } from '../../../utils/date-helpers';
import { getFullName, userCanDeleteMessage } from '../../../utils/user-helpers';
import { MessageItemOrganization } from './MessageItemOrganization';
import { MessageMenu } from './MessageMenu';

interface MessageListProps {
  ticket: Ticket;
}

export const TicketMessageList = ({ ticket }: MessageListProps) => {
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
        {messages.map((message) => {
          const canDeleteMessage = !!user && userCanDeleteMessage(user, message, ticket.type);
          return (
            <MessageItem
              key={message.identifier}
              text={message.text}
              date={message.createdDate}
              username={message.sender}
              backgroundColor={'secondary.light'}
              menuElement={canDeleteMessage && <MessageMenu messageId={message.id} />}
            />
          );
        })}
      </Box>
    </ErrorBoundary>
  );
};

interface MessageItemProps {
  text: ReactNode;
  date: string;
  username: string;
  backgroundColor: BoxProps['bgcolor'];
  menuElement?: ReactNode;
  showOrganization?: boolean;
}

export const MessageItem = ({
  text,
  date,
  username,
  backgroundColor,
  menuElement,
  showOrganization = false,
}: MessageItemProps) => {
  const { t } = useTranslation();

  const senderQuery = useFetchUserQuery(username);
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
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: '0.3rem' }}>
        <Tooltip title={senderName ? senderName : t('common.unknown')}>
          <StyledTruncatableTypography
            data-testid={dataTestId.registrationLandingPage.tasksPanel.messageSender}
            sx={{ fontWeight: 'bold' }}>
            {senderQuery.isPending ? (
              <Skeleton sx={{ width: '8rem' }} />
            ) : senderName ? (
              senderName
            ) : (
              <i>{t('common.unknown')}</i>
            )}
          </StyledTruncatableTypography>
        </Tooltip>
        {showOrganization ? (
          <MessageItemOrganization organizationId={senderQuery.data?.institutionCristinId ?? ''} />
        ) : (
          <Typography data-testid={dataTestId.registrationLandingPage.tasksPanel.messageTimestamp}>
            {toDateString(date)}
          </Typography>
        )}
        {menuElement}
      </Box>

      <Divider sx={{ mb: '0.5rem', bgcolor: 'primary.main' }} />

      <Box
        sx={{ color: 'primary.main' }}
        data-testid={dataTestId.registrationLandingPage.tasksPanel.messageText}
        component={typeof text === 'string' ? Typography : 'div'}>
        {text ? text : <i>{t('my_page.messages.message_deleted')}</i>}
      </Box>
    </Box>
  );
};
