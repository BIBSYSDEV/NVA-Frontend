import { TicketType, TicketTypeEnum } from '../../types/publication_types/ticket.types';
import { PublishingRequestTag } from './components/TicketTypeTags/PublishingRequestTag';
import { DoiRequestTag } from './components/TicketTypeTags/DoiRequestTag';
import { FilesApprovalThesisTag } from './components/TicketTypeTags/FilesApprovalThesisTag';
import { GeneralSupportCaseTag } from './components/TicketTypeTags/GeneralSupportCaseTag';

export const getTicketColor = (ticketType: TicketType) => {
  switch (ticketType) {
    case TicketTypeEnum.PublishingRequest:
      return 'taskType.publishingRequest.main';
    case TicketTypeEnum.DoiRequest:
      return 'taskType.doiRequest.main';
    case TicketTypeEnum.GeneralSupportCase:
      return 'taskType.generalSupportCase.main';
    case TicketTypeEnum.FilesApprovalThesis:
      return 'taskType.filesApprovalThesis.main';
    case TicketTypeEnum.UnpublishRequest:
      return 'taskType.unpublishRequest.main';
    default:
      return 'grey.500';
  }
};

export const selectTicketTypeTag = (ticketType: TicketType) => {
  switch (ticketType) {
    case TicketTypeEnum.PublishingRequest:
      return <PublishingRequestTag />;
    case TicketTypeEnum.DoiRequest:
      return <DoiRequestTag />;
    case TicketTypeEnum.GeneralSupportCase:
      return <GeneralSupportCaseTag />;
    case TicketTypeEnum.FilesApprovalThesis:
      return <FilesApprovalThesisTag />;
    case TicketTypeEnum.UnpublishRequest:
      return null;
    default:
      return null;
  }
};
