import { Box, Typography, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PublishingTicket } from '../../../types/publication_types/messages.types';

export const StyledMessagesContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.1rem',
});

export const StyledStatusMessageBox = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '1rem',
  padding: '0.2rem 1rem',
});

export const PublishingRequestMessagesColumn = ({ ticket }: { ticket: PublishingTicket }) => {
  const { t } = useTranslation();

  return (
    <StyledMessagesContainer>
      {ticket.workflow === 'RegistratorPublishesMetadataOnly' ? (
        <>
          <StyledStatusMessageBox sx={{ bgcolor: 'publishingRequest.main' }}>
            <Typography>{t('registration.status.PUBLISHED_METADATA')}</Typography>
            {ticket.publication.publishedDate && (
              <Typography>{new Date(ticket.publication.publishedDate).toLocaleDateString()}</Typography>
            )}
          </StyledStatusMessageBox>
          {ticket.status === 'Pending' || ticket.status === 'New' ? (
            <StyledStatusMessageBox sx={{ bgcolor: 'secondary.dark' }}>
              <Typography>{t('registration.files_and_license.files_awaits_approval_unknown')}</Typography>
            </StyledStatusMessageBox>
          ) : ticket.status === 'Completed' ? (
            <StyledStatusMessageBox sx={{ bgcolor: 'publishingRequest.main' }}>
              <Typography>{t('my_page.messages.files_published')}</Typography>
              {ticket.modifiedDate && <Typography>{new Date(ticket.modifiedDate).toLocaleDateString()}</Typography>}
            </StyledStatusMessageBox>
          ) : (
            <StyledStatusMessageBox sx={{ bgcolor: 'warning.light' }}>
              <Typography>{t('my_page.messages.files_rejected')}</Typography>
              {ticket.modifiedDate && <Typography>{new Date(ticket.modifiedDate).toLocaleDateString()}</Typography>}
            </StyledStatusMessageBox>
          )}
        </>
      ) : null}
    </StyledMessagesContainer>
  );
};
