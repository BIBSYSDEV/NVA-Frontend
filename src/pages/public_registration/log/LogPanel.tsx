import { Box, Skeleton, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { useFetchRegistrationLog } from '../../../api/hooks/useFetchRegistrationLog';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { LogEntry } from '../../../types/log.types';
import { Message, PublishingTicket, Ticket } from '../../../types/publication_types/ticket.types';
import { Registration } from '../../../types/registration.types';
import { isSimilarTime } from '../../../utils/general-helpers';
import { ArchivedFilesLogInfo } from './ArchivedFilesLogInfo';
import { LogDateItem } from './LogDateItem';
import { LogEntryItem } from './LogEntryItem';

interface LogPanelProps {
  registration: Registration;
  tickets: Ticket[];
}

export const LogPanel = ({ registration, tickets }: LogPanelProps) => {
  const { t } = useTranslation();
  const logQuery = useFetchRegistrationLog(registration.id);
  const sortedLogEntries =
    logQuery.data?.logEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) ?? [];

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', bgcolor: 'secondary.main' }}
      aria-busy={logQuery.isPending}>
      <Typography variant="h2" sx={visuallyHidden}>
        {t('common.log')}
      </Typography>

      <Box sx={{ p: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography color="grey.700" sx={{ textAlign: 'center' }}>
          {t('log.metadata_last_updated')}
        </Typography>
        <LogDateItem date={registration.modifiedDate} />
      </Box>
      <ArchivedFilesLogInfo registration={registration} />

      {logQuery.isPending ? (
        <>
          <Skeleton variant="rectangular" height={150} />
          <Skeleton variant="rectangular" height={150} />
          <Skeleton variant="rectangular" height={150} />
        </>
      ) : (
        sortedLogEntries.map((logEntry, index) => (
          <ErrorBoundary key={index}>
            <LogEntryItem logEntry={logEntry} messages={getLogEntryMessages(logEntry, tickets)} />
          </ErrorBoundary>
        ))
      )}
    </Box>
  );
};

const getLogEntryMessages = (logEntry: LogEntry, tickets: Ticket[]): Message[] => {
  const ticketsWithinSimilarTime = tickets.filter(
    (ticket) => ticket.finalizedDate && isSimilarTime(ticket.finalizedDate, logEntry.timestamp, 10_000)
  );

  if (logEntry.topic === 'FileApproved' || logEntry.topic === 'FileRejected') {
    const publishingTickets = ticketsWithinSimilarTime.filter(
      (ticket) => ticket.type === 'PublishingRequest'
    ) as PublishingTicket[];
    const matchingTicket = publishingTickets.find((ticket) =>
      [...ticket.filesForApproval, ...ticket.approvedFiles].some(
        (file) => file.identifier === logEntry.fileIdentifier && file.type === logEntry.fileType
      )
    );
    return matchingTicket?.messages ?? [];
  }

  if (logEntry.topic === 'DoiAssigned' || logEntry.topic === 'DoiRejected') {
    const doiRequestTicket = ticketsWithinSimilarTime.find((ticket) => ticket.type === 'DoiRequest');
    return doiRequestTicket?.messages ?? [];
  }

  return [];
};
