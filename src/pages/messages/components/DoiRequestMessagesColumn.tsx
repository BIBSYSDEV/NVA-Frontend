import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ExpandedTicket, Ticket } from '../../../types/publication_types/ticket.types';
import { toDateString } from '../../../utils/date-helpers';
import { LastMessageBox } from './LastMessageBox';
import { StyledMessagesContainer, StyledStatusMessageBox } from './PublishingRequestMessagesColumn';

interface DoiRequestMessagesColumnProps {
  ticket: ExpandedTicket | Ticket;
  showLastMessage?: boolean;
}

export const DoiRequestMessagesColumn = ({ ticket, showLastMessage }: DoiRequestMessagesColumnProps) => {
  const { t } = useTranslation();

  return (
    <StyledMessagesContainer>
      {ticket.status === 'New' || ticket.status === 'Pending' ? (
        <>
          {showLastMessage && <LastMessageBox ticket={ticket as ExpandedTicket} />}
          <StyledStatusMessageBox sx={{ bgcolor: 'secondary.dark' }}>
            <Typography>{t('my_page.messages.doi_pending')}</Typography>
          </StyledStatusMessageBox>
        </>
      ) : (
        <>
          {showLastMessage && <LastMessageBox ticket={ticket as ExpandedTicket} />}
          <StyledStatusMessageBox sx={{ bgcolor: 'doiRequest.main' }}>
            {ticket.status === 'Completed' ? (
              <Typography>{t('my_page.messages.doi_completed')}</Typography>
            ) : ticket.status === 'Closed' ? (
              <Typography>{t('my_page.messages.doi_closed')}</Typography>
            ) : null}
            {ticket.modifiedDate && <Typography>{toDateString(ticket.modifiedDate)}</Typography>}
          </StyledStatusMessageBox>
        </>
      )}
    </StyledMessagesContainer>
  );
};
