import { Box, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { useFetchRegistrationLog } from '../../../api/hooks/useFetchRegistrationLog';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { LogDateItem } from '../../../components/Log/LogDateItem';
import { ArchivedFilesEntry } from '../../../components/Log/RegistrationLog';
import { FileType } from '../../../types/associatedArtifact.types';
import { LogEntryObject } from '../../../types/log.types';
import { Message, PublishingTicket, Ticket } from '../../../types/publication_types/ticket.types';
import { Registration } from '../../../types/registration.types';
import { isSimilarTime } from '../../../utils/general-helpers';
import { LogEntry } from './LogEntry';

interface LogPanelProps {
  registration: Registration;
  tickets: Ticket[];
}

export const LogPanel = ({ registration, tickets }: LogPanelProps) => {
  const { t } = useTranslation();
  const logQuery = useFetchRegistrationLog(registration.id);

  const internalFilesCount = registration.associatedArtifacts.filter(
    (file) => file.type === FileType.InternalFile
  ).length;
  const hiddenFilesCount = registration.associatedArtifacts.filter((file) => file.type === FileType.HiddenFile).length;

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
        <LogDateItem date={new Date(registration.modifiedDate)} />
      </Box>
      <ArchivedFilesEntry numberOfArchivedFiles={internalFilesCount} numberOfHiddenFiles={hiddenFilesCount} />

      {logQuery.isPending ? (
        <>
          <Skeleton variant="rectangular" height={150} />
          <Skeleton variant="rectangular" height={150} />
          <Skeleton variant="rectangular" height={150} />
        </>
      ) : (
        logQuery.data?.logEntries.toReversed().map((logEntry, index) => (
          <ErrorBoundary key={index}>
            <LogEntry logEntry={logEntry} messages={getLogEntryMessages(logEntry, tickets)} />
          </ErrorBoundary>
        ))
      )}
    </Box>
  );
};

const getLogEntryMessages = (logEntry: LogEntryObject, tickets: Ticket[]): Message[] => {
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
