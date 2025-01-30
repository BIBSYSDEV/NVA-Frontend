import { Typography } from '@mui/material';
import { useFetchRegistrationLog } from '../../api/hooks/useFetchRegistrationLog';
import { Ticket } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';

interface LogPanelProps {
  tickets: Ticket[];
  registration: Registration;
}

export const LogPanel2 = ({ registration, tickets }: LogPanelProps) => {
  const logQuery = useFetchRegistrationLog(registration.id);
  console.log(logQuery.data);

  return (
    <>
      {logQuery.data &&
        logQuery.data.logEntries.map((logEntry) => {
          return (
            <Typography key={logEntry.timestamp}>
              {logEntry.type} - {logEntry.topic}
            </Typography>
          );
        })}
    </>
  );
};
