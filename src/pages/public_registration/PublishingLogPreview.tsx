import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Ticket } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';
import { toDateString } from '../../utils/date-helpers';
import { generateSimplePublishingLog } from '../../utils/log/logFactory';
import { StyledStatusMessageBox } from '../messages/components/PublishingRequestMessagesColumn';

interface PublishingLogPreviewProps {
  registration: Registration;
  tickets: Ticket[];
}

export const PublishingLogPreview = ({ registration, tickets }: PublishingLogPreviewProps) => {
  const { t } = useTranslation();
  const logEntries = generateSimplePublishingLog(registration, tickets, t);

  if (logEntries.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', mb: '0.5rem' }}>
      {logEntries.map((entry, index) => (
        <StyledStatusMessageBox key={index} sx={{ bgcolor: 'publishingRequest.main' }}>
          <Typography>{entry.text}</Typography>
          <Typography>{toDateString(entry.date)}</Typography>
        </StyledStatusMessageBox>
      ))}
    </Box>
  );
};