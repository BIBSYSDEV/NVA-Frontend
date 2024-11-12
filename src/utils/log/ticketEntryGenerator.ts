import { TFunction } from 'i18next';
import { LogEntry } from '../../types/log.types';
import { PublishingTicket, Ticket } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';
import { getAssociatedFiles } from '../registration-helpers';
import { generateDoiRequestLogEntry } from './doiRequestGenerator';
import { generatePublishingRequestLogEntry } from './publishingRequestGenerator';

export function generateTicketLogEntries(tickets: Ticket[], registration: Registration, t: TFunction): LogEntry[] {
  return tickets
    .filter(onlyPublishingRequestsWithFiles)
    .flatMap((ticket) => generateTicketLogEntry(ticket, registration, t))
    .filter((entry) => entry !== undefined);
}

function generateTicketLogEntry(
  ticket: Ticket,
  registration: Registration,
  t: TFunction
): LogEntry[] | LogEntry | undefined {
  const associatedFiles = getAssociatedFiles(registration.associatedArtifacts);

  switch (ticket.type) {
    case 'PublishingRequest': {
      return generatePublishingRequestLogEntry(ticket as PublishingTicket, associatedFiles, t);
    }
    case 'DoiRequest': {
      return generateDoiRequestLogEntry(ticket, t);
    }
    case 'GeneralSupportCase':
    default: {
      return undefined;
    }
  }
}

// NB: Will interfere with tickets with only metadata updates if they are added in the future.
// For now this serves to avoid a corner case where publishing metadata without files creates
// a "metadata updated" entry when it's actually only a "metadata published" entry.
function onlyPublishingRequestsWithFiles(ticket: Ticket) {
  return (
    ticket.type !== 'PublishingRequest' ||
    (ticket as PublishingTicket).filesForApproval.length > 0 ||
    (ticket as PublishingTicket).approvedFiles.length > 0
  );
}
