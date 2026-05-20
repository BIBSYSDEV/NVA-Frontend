import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SellIcon from '@mui/icons-material/Sell';
import { Box, BoxProps, Divider, Skeleton, Tooltip, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchUserQuery } from '../../../api/hooks/useFetchUserQuery';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { EllipsisTypography, HorizontalBox } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { toDateString, toDateStringWithTime } from '../../../utils/date-helpers';
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
              messageType={'Message'}
              backgroundColor={'background.neutral87'}
              menuElement={canDeleteMessage && <MessageMenu messageId={message.id} />}
            />
          );
        })}
      </Box>
    </ErrorBoundary>
  );
};

interface MessageItemProps {
  text: string | undefined;
  date: string;
  username: string;
  backgroundColor: BoxProps['bgcolor'];
  menuElement?: ReactNode;
  showOrganization?: boolean;
  messageType?: 'Justification' | 'Message' | 'Comment' | 'Approval';
}

export const MessageItem = ({
  text,
  date,
  username,
  menuElement,
  showOrganization = false,
  messageType = 'Comment',
  backgroundColor = 'background.neutral87',
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
        color: 'textPrimary.main',
      }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: '0.3rem' }}>
        <HorizontalBox sx={{ gap: '0.25rem', color: 'textPrimary.main' }}>
          {messageType === 'Justification' || messageType === 'Approval' ? (
            <SellIcon sx={{ fontSize: '1.1rem', color: 'textPrimary.main' }} />
          ) : (
            <ChatBubbleIcon sx={{ fontSize: '1.1rem', color: 'textPrimary.main' }} />
          )}
          <Typography sx={{ fontWeight: 'bold', color: 'textPrimary.main' }}>
            {messageType === 'Justification'
              ? t('common.justification')
              : messageType === 'Approval'
                ? t('approved')
                : messageType === 'Message'
                  ? t('common.message')
                  : t('tasks.nvi.note')}
          </Typography>
        </HorizontalBox>
        {showOrganization ? (
          <MessageItemOrganization organizationId={senderQuery.data?.institutionCristinId ?? ''} />
        ) : undefined}
        {menuElement}
      </Box>

      <Divider sx={{ mb: '0.5rem', bgcolor: 'primary.main' }} />

      <Box
        sx={{ color: 'textPrimary.main', my: '0.1rem' }}
        data-testid={dataTestId.registrationLandingPage.tasksPanel.messageText}
        component={Typography}>
        {text ? text : messageType !== 'Approval' ? <i>{t('my_page.messages.message_deleted')}</i> : undefined}
      </Box>
      <HorizontalBox sx={{ gap: '1rem', color: 'textPrimary.main' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Tooltip title={senderName ? senderName : t('common.unknown')}>
            <EllipsisTypography
              data-testid={dataTestId.registrationLandingPage.tasksPanel.messageSender}
              sx={{
                fontWeight: 'bold',
                maxWidth: { sm: '10rem', md: '12rem', lg: '18rem', xl: '30rem' },
                color: 'textPrimary.main',
              }}>
              {senderQuery.isPending ? (
                <Skeleton sx={{ width: '8rem' }} />
              ) : senderName ? (
                senderName
              ) : (
                <i>{t('common.unknown')}</i>
              )}
            </EllipsisTypography>
          </Tooltip>
        </Box>
        <Tooltip title={toDateStringWithTime(date)}>
          <HorizontalBox sx={{ gap: '0.25rem', color: 'textPrimary.main' }}>
            <CalendarMonthIcon sx={{ color: 'textPrimary.main' }} />
            <Typography
              sx={{ pt: '0.1rem', color: 'textPrimary.main' }}
              data-testid={dataTestId.registrationLandingPage.tasksPanel.messageTimestamp}>
              {toDateString(date)}
            </Typography>
          </HorizontalBox>
        </Tooltip>
      </HorizontalBox>
    </Box>
  );
};
