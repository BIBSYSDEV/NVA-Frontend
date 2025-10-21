import { mainTheme } from '../../themes/mainTheme';
import { TicketType } from '../../types/publication_types/ticket.types';

export const getTicketColor = (ticketType: TicketType) => {
  switch (ticketType) {
    case 'PublishingRequest':
      return mainTheme.palette.taskType.publishingRequest.main;
    case 'DoiRequest':
      return mainTheme.palette.taskType.doiRequest.main;
    case 'GeneralSupportCase':
      return mainTheme.palette.taskType.generalSupportCase.main;
    case 'FilesApprovalThesis':
      return mainTheme.palette.taskType.filesApprovalThesis.main;
    case 'UnpublishRequest':
      return mainTheme.palette.taskType.unpublishRequest.main;
    default:
      return 'grey.500';
  }
};
