import { Box, Divider, Skeleton, Tooltip, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { useFetchUser } from '../../../api/hooks/useFetchUser';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { StyledTruncatableTypography } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { toDateString } from '../../../utils/date-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';
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

  const senderQuery = useFetchUser(username);
  const senderName = getFullName(senderQuery.data?.givenName, senderQuery.data?.familyName);

  const organizationQuery = useFetchOrganization(senderQuery.data?.institutionCristinId ?? '');
  const organizationName = getLanguageString(organizationQuery.data?.labels);

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
        <Typography data-testid={dataTestId.registrationLandingPage.tasksPanel.messageTimestamp}>
          {toDateString(date)}
        </Typography>
        {menuElement}

        <Tooltip title={organizationName}>
          <StyledTruncatableTypography sx={{ gridColumn: '1/-1' }}>
            {organizationQuery.isPending ? (
              <Skeleton sx={{ width: '80%' }} />
            ) : organizationName ? (
              organizationName
            ) : (
              <i>{t('common.unknown')}</i>
            )}
          </StyledTruncatableTypography>
        </Tooltip>
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
