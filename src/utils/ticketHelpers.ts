import { Ticket } from '../types/publication_types/ticket.types';

export const isFileApprovalTicket = (ticket: Pick<Ticket, 'type'>) => {
  return ticket.type === 'PublishingRequest' || ticket.type === 'FilesApprovalThesis';
};
