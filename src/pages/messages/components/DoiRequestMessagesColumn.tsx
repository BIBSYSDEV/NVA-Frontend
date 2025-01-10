import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Box, Typography } from '@mui/material';
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
          <StyledStatusMessageBox sx={{ bgcolor: 'secondary.dark' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <HourglassEmptyIcon fontSize="small" />
              <Typography>{t('my_page.messages.doi_pending')}</Typography>
            </Box>
          </StyledStatusMessageBox>
          {showLastMessage && <LastMessageBox ticket={ticket as ExpandedTicket} />}
        </>
      ) : ticket.status === 'Completed' ? (
        <StyledStatusMessageBox sx={{ bgcolor: 'doiRequest.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <CheckIcon fontSize="small" />
            <Typography>{t('my_page.messages.doi_completed')}</Typography>
          </Box>
          {ticket.modifiedDate && <Typography>{toDateString(ticket.modifiedDate)}</Typography>}
        </StyledStatusMessageBox>
      ) : ticket.status === 'Closed' ? (
        <>
          <StyledStatusMessageBox sx={{ bgcolor: 'secondary.dark' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <BlockIcon fontSize="small" />
              <Typography>{t('my_page.messages.doi_closed')}</Typography>
            </Box>
            {ticket.modifiedDate && <Typography>{toDateString(ticket.modifiedDate)}</Typography>}
          </StyledStatusMessageBox>
          {showLastMessage && <LastMessageBox ticket={ticket as ExpandedTicket} />}
        </>
      ) : null}
    </StyledMessagesContainer>
  );
};
