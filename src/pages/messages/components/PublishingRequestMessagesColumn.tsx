import { Box, Typography, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ExpandedPublishingTicket, PublishingTicket } from '../../../types/publication_types/ticket.types';

export const StyledMessagesContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

export const StyledStatusMessageBox = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '0.5rem 1rem',
  padding: '0.2rem 1rem',
  borderRadius: '4px',
});

interface PublishingRequestMessagesColumnProps {
  ticket: ExpandedPublishingTicket | PublishingTicket;
}

export const PublishingRequestMessagesColumn = ({ ticket }: PublishingRequestMessagesColumnProps) => {
  const { t } = useTranslation();

  return (
    <StyledMessagesContainer>
      {ticket.status === 'Pending' || ticket.status === 'New' ? (
        <StyledStatusMessageBox sx={{ bgcolor: 'secondary.dark' }}>
          <Typography>
            {ticket.filesForApproval.length
              ? t('registration.files_and_license.files_awaits_approval', { count: ticket.filesForApproval.length })
              : t('registration.files_and_license.files_awaits_approval_unknown')}
          </Typography>
        </StyledStatusMessageBox>
      ) : (
        <StyledStatusMessageBox sx={{ bgcolor: 'publishingRequest.main' }}>
          {ticket.status === 'Completed' ? (
            <Typography>
              {ticket.approvedFiles.length
                ? t('my_page.messages.files_published', { count: ticket.approvedFiles.length })
                : t('my_page.messages.files_published_unknown')}
            </Typography>
          ) : (
            ticket.status === 'Closed' && <Typography>{t('my_page.messages.files_rejected')}</Typography>
          )}
          {ticket.modifiedDate && <Typography>{new Date(ticket.modifiedDate).toLocaleDateString()}</Typography>}
        </StyledStatusMessageBox>
      )}
    </StyledMessagesContainer>
  );
};
