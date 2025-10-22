import { TicketType } from '../../types/publication_types/ticket.types';
import { PublishingRequestTag } from './components/TicketTypeTags/PublishingRequestTag';
import { DoiRequestTag } from './components/TicketTypeTags/DoiRequestTag';
import { FilesApprovalThesisTag } from './components/TicketTypeTags/FilesApprovalThesisTag';
import { GeneralSupportCaseTag } from './components/TicketTypeTags/GeneralSupportCaseTag';

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

export const selectTicketTypeTag = (ticketType: TicketType) => {
  switch (ticketType) {
    case 'PublishingRequest':
      return <PublishingRequestTag />;
    case 'DoiRequest':
      return <DoiRequestTag />;
    case 'GeneralSupportCase':
      return <GeneralSupportCaseTag />;
    case 'FilesApprovalThesis':
      return <FilesApprovalThesisTag />;
    case 'UnpublishRequest':
      return <PublishingRequestTag />;
    default:
      return null;
  }
};
