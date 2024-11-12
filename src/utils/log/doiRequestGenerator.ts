import { TFunction } from 'i18next';
import { LogEntry } from '../../types/log.types';
import { Ticket } from '../../types/publication_types/ticket.types';

export function generateDoiRequestLogEntry(ticket: Ticket, t: TFunction): LogEntry | undefined {
  switch (ticket.status) {
    case 'Completed': {
      return generateDoiGivenLogEntry(ticket, t);
    }
    case 'Closed': {
      return generateDoiRejectedLogEntry(ticket, t);
    }
    case 'New':
    case 'Pending': {
      return generateDoiRequestedLogEntry(ticket, t);
    }
    case 'NotApplicable':
    default: {
      return undefined;
    }
  }
}

function generateDoiGivenLogEntry(ticket: Ticket, t: TFunction): LogEntry {
  return {
    type: 'DoiRequest',
    title: t('log.titles.doi_given'),
    modifiedDate: ticket.finalizedDate ?? '',
    actions: [
      {
        actor: ticket.finalizedBy,
        items: [],
      },
    ],
  };
}

function generateDoiRejectedLogEntry(ticket: Ticket, t: TFunction): LogEntry {
  return {
    type: 'DoiRequest',
    title: t('log.titles.doi_rejected'),
    modifiedDate: ticket.finalizedDate ?? '',
    actions: [
      {
        actor: ticket.finalizedBy,
        items: [],
      },
    ],
  };
}

function generateDoiRequestedLogEntry(ticket: Ticket, t: TFunction): LogEntry {
  return {
    type: 'DoiRequest',
    title: t('log.titles.doi_requested'),
    modifiedDate: ticket.createdDate,
    actions: [
      {
        actor: ticket.owner,
        items: [],
      },
    ],
  };
}
