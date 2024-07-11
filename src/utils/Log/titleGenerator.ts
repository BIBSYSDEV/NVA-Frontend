import { TFunction } from 'i18next';
import { PublishingTicket, Ticket } from '../../types/publication_types/ticket.types';

export function generateTitleFromTicket(ticket: Ticket, t: TFunction) {
  switch (ticket.type) {
    case 'PublishingRequest': {
      return generateTitleFromPublishingTicket(ticket as PublishingTicket, t);
    }
    case 'DoiRequest': {
      return generateTitleFromDoiTicket(ticket, t);
    }
    case 'GeneralSupportCase':
    default: {
      return '';
    }
  }
}

function generateTitleFromPublishingTicket(ticket: PublishingTicket, t: TFunction) {
  if (ticket.status === 'Completed') {
    if (ticket.approvedFiles.length > 0) {
      return t('log.titles.files_published', { count: ticket.approvedFiles.length });
    }

    return t('log.titles.metadata_updated');
  }

  if (ticket.status === 'Closed') {
    return t('log.titles.files_rejected');
  }

  if (ticket.status === 'New' || ticket.status === 'Pending') {
    return t('my_page.messages.files_uploaded', { count: ticket.filesForApproval.length });
  }

  return '';
}

function generateTitleFromDoiTicket(ticket: Ticket, t: TFunction) {
  if (ticket.status === 'Completed') {
    return t('my_page.messages.doi_completed');
  }

  if (ticket.status === 'Closed') {
    return t('my_page.messages.doi_closed');
  }

  return '';
}
