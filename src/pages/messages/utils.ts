import { TicketType } from '../../types/publication_types/ticket.types';

export const getTicketColor = (ticketType: TicketType) => {
  switch (ticketType) {
    case 'PublishingRequest':
      return 'taskType.publishingRequest.main';
    case 'DoiRequest':
      return 'taskType.doiRequest.main';
    case 'GeneralSupportCase':
      return 'taskType.generalSupportCase.main';
    case 'FilesApprovalThesis':
      return 'taskType.filesApprovalThesis.main';
    case 'UnpublishRequest':
      return 'taskType.unpublishRequest.main';
    default:
      return 'grey.500';
  }
};
