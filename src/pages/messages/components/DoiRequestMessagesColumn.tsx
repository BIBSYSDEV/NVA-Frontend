import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ExpandedTicket } from '../../../types/publication_types/ticket.types';
import { StyledMessagesContainer, StyledStatusMessageBox } from './PublishingRequestMessagesColumn';

interface DoiRequestMessagesColumnProps {
  ticket: ExpandedTicket;
}

export const DoiRequestMessagesColumn = ({ ticket }: DoiRequestMessagesColumnProps) => {
  const { t } = useTranslation();

  return (
    <StyledMessagesContainer>
      {ticket.status === 'New' || ticket.status === 'Pending' ? (
        <>
          <StyledStatusMessageBox sx={{ bgcolor: 'doiRequest.main' }}>
            <Typography>{t('my_page.messages.doi_requested')}</Typography>
            <Typography>{new Date(ticket.createdDate).toLocaleDateString()}</Typography>
          </StyledStatusMessageBox>
          <StyledStatusMessageBox sx={{ bgcolor: 'secondary.dark' }}>
            <Typography>{t('my_page.messages.doi_pending')}</Typography>
          </StyledStatusMessageBox>
        </>
      ) : ticket.status === 'Completed' ? (
        <StyledStatusMessageBox sx={{ bgcolor: 'doiRequest.main' }}>
          <Typography>{t('my_page.messages.doi_completed')}</Typography>
          {ticket.modifiedDate && <Typography>{new Date(ticket.modifiedDate).toLocaleDateString()}</Typography>}
        </StyledStatusMessageBox>
      ) : ticket.status === 'Closed' ? (
        <StyledStatusMessageBox sx={{ bgcolor: 'warning.light' }}>
          <Typography>{t('my_page.messages.doi_closed')}</Typography>
          {ticket.modifiedDate && <Typography>{new Date(ticket.modifiedDate).toLocaleDateString()}</Typography>}
        </StyledStatusMessageBox>
      ) : null}
    </StyledMessagesContainer>
  );
};
