import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ExpandedTicket, Ticket } from '../../../types/publication_types/ticket.types';
import { toDateString } from '../../../utils/date-helpers';
import { StyledMessagesContainer, StyledStatusMessageBox } from './PublishingRequestMessagesColumn';

interface DoiRequestMessagesColumnProps {
  ticket: ExpandedTicket | Ticket;
}

export const DoiRequestMessagesColumn = ({ ticket }: DoiRequestMessagesColumnProps) => {
  const { t } = useTranslation();

  return (
    <StyledMessagesContainer>
      {ticket.status === 'New' || ticket.status === 'Pending' ? (
        <StyledStatusMessageBox sx={{ bgcolor: 'secondary.dark' }}>
          <Typography>{t('my_page.messages.doi_pending')}</Typography>
        </StyledStatusMessageBox>
      ) : (
        <StyledStatusMessageBox sx={{ bgcolor: 'doiRequest.main' }}>
          {ticket.status === 'Completed' ? (
            <Typography>{t('my_page.messages.doi_completed')}</Typography>
          ) : ticket.status === 'Closed' ? (
            <Typography>{t('my_page.messages.doi_closed')}</Typography>
          ) : null}
          {ticket.modifiedDate && <Typography>{toDateString(ticket.modifiedDate)}</Typography>}
        </StyledStatusMessageBox>
      )}
    </StyledMessagesContainer>
  );
};
