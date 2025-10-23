import { TicketType, TicketTypeEnum } from '../../types/publication_types/ticket.types';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';

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

export const getTicketTypeIcon = (ticketType: TicketType) => {
  switch (ticketType) {
    case TicketTypeEnum.PublishingRequest:
      return <InsertDriveFileOutlinedIcon fontSize="small" />;
    case TicketTypeEnum.DoiRequest:
      return <AddLinkOutlinedIcon fontSize="small" />;
    case TicketTypeEnum.GeneralSupportCase:
      return <ChatBubbleOutlineOutlinedIcon fontSize="small" />;
    case TicketTypeEnum.FilesApprovalThesis:
      return <SchoolOutlinedIcon fontSize="small" />;
    case TicketTypeEnum.UnpublishRequest:
    default:
      return null;
  }
};
