import { TFunction } from 'i18next';
import { generateActionsFromTicket } from './actionGenerator';
import { generateTitleFromTicket } from './titleGenerator';
import { getAssociatedFiles } from '../registration-helpers';
import { LogEntry } from '../../types/log.types';
import { PublishingTicket, Ticket } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';

export function generateTicketLogEntries(tickets: Ticket[], registration: Registration, t: TFunction): LogEntry[] {
  return tickets
    .filter((ticket) => ticket.type === 'PublishingRequest' || ticket.type === 'DoiRequest')
    .filter(onlyPublishingRequestsWithFiles)
    .map((ticket) => generateTicketLogEntry(ticket, registration, t));
}

function generateTicketLogEntry(ticket: Ticket, registration: Registration, t: TFunction): LogEntry {
  const associatedFiles = getAssociatedFiles(registration.associatedArtifacts);

  return {
    type: ticket.type,
    title: generateTitleFromTicket(ticket, t),
    modifiedDate: ticket.modifiedDate,
    actions: generateActionsFromTicket(ticket, associatedFiles, t),
  };
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
