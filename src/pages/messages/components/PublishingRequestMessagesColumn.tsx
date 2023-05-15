import { Box, Typography, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PublishingTicket } from '../../../types/publication_types/messages.types';

const StatusMessageBox = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '1rem',
  padding: '0.2rem 1rem',
});

export const PublishingRequestMessagesColumn = ({ ticket }: { ticket: PublishingTicket }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
      {ticket.workflow === 'RegistratorPublishesMetadataOnly' ? (
        <>
          <StatusMessageBox sx={{ bgcolor: 'publishingRequest.main' }}>
            <Typography>{t('registration.status.PUBLISHED_METADATA')}</Typography>
            {ticket.publication.publishedDate && (
              <Typography>{new Date(ticket.publication.publishedDate).toLocaleDateString()}</Typography>
            )}
          </StatusMessageBox>
          {ticket.status === 'Pending' || ticket.status === 'New' ? (
            <StatusMessageBox sx={{ bgcolor: 'secondary.dark' }}>
              <Typography>{t('registration.files_and_license.files_awaits_approval_unknown')}</Typography>
            </StatusMessageBox>
          ) : ticket.status === 'Completed' ? (
            <StatusMessageBox sx={{ bgcolor: 'publishingRequest.main' }}>
              <Typography>{t('my_page.messages.files_published')}</Typography>
              {ticket.modifiedDate && <Typography>{new Date(ticket.modifiedDate).toLocaleDateString()}</Typography>}
            </StatusMessageBox>
          ) : (
            <StatusMessageBox sx={{ bgcolor: 'warning.light' }}>
              <Typography>{t('my_page.messages.files_rejected')}</Typography>
              {ticket.modifiedDate && <Typography>{new Date(ticket.modifiedDate).toLocaleDateString()}</Typography>}
            </StatusMessageBox>
          )}
        </>
      ) : null}
    </Box>
  );
};
