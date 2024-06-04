import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TruncatableTypography } from '../../../components/TruncatableTypography';
import { ExpandedTicket } from '../../../types/publication_types/ticket.types';
import { toDateString } from '../../../utils/date-helpers';
import { StyledMessagesContainer, StyledStatusMessageBox } from './PublishingRequestMessagesColumn';

interface SupportMessagesColumnProps {
  ticket: ExpandedTicket;
}

export const SupportMessagesColumn = ({ ticket }: SupportMessagesColumnProps) => {
  const { t } = useTranslation();
  const lastMessage = ticket.messages.at(-1);

  const lastSender = lastMessage
    ? `${lastMessage.sender.preferredFirstName || lastMessage.sender.firstName} ${
        lastMessage.sender.preferredLastName || lastMessage.sender.lastName
      }`.trim()
    : '';

  return (
    <StyledMessagesContainer>
      {ticket.status === 'New' || ticket.status === 'Pending' ? (
        <>
          {lastMessage && (
            <StyledStatusMessageBox sx={{ bgcolor: 'generalSupportCase.main' }}>
              <TruncatableTypography lines={5} sx={{ gridColumn: '1/3' }}>
                {lastMessage.text}
              </TruncatableTypography>
            </StyledStatusMessageBox>
          )}
          <StyledStatusMessageBox sx={{ bgcolor: 'secondary.dark' }}>
            <Typography>{t('my_page.messages.general_support_pending')}</Typography>
          </StyledStatusMessageBox>
        </>
      ) : (
        lastMessage && (
          <StyledStatusMessageBox sx={{ bgcolor: 'generalSupportCase.main' }}>
            <Typography>{lastSender}</Typography>
            <Typography>{toDateString(lastMessage.createdDate)}</Typography>
            <TruncatableTypography lines={5} sx={{ gridColumn: '1/3' }}>
              {lastMessage.text}
            </TruncatableTypography>
          </StyledStatusMessageBox>
        )
      )}
    </StyledMessagesContainer>
  );
};
