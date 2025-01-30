import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RegistrationLog } from '../../components/Log/RegistrationLog';
import { Ticket } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';
import { generateLog } from '../../utils/log/logFactory';

interface LogPanelProps {
  tickets: Ticket[];
  registration: Registration;
}

export const LogPanel = ({ tickets, registration }: LogPanelProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', bgcolor: 'secondary.main' }}>
      <RegistrationLog log={generateLog(registration, tickets, t)} />
    </Box>
  );
};
