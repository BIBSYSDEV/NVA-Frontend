import { TFunction } from 'i18next';
import { generateActionsFromTicket } from './actionGenerator';
import { generateTitleFromTicket } from './titleGenerator';
import { getAssociatedFiles } from '../registration-helpers';
import { LogEntry } from '../../types/log.types';
import { Ticket } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';

export function generateTicketLogEntries(tickets: Ticket[], registration: Registration, t: TFunction): LogEntry[] {
  return tickets.map((ticket) => generateTicketLogEntry(ticket, registration, t));
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
