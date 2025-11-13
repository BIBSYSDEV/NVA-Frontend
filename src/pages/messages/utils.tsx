import { TicketType, TicketTypeEnum } from '../../types/publication_types/ticket.types';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';
import {
  NviCandidateGlobalStatus,
  NviCandidateGlobalStatusEnum,
  NviCandidateStatus,
  NviCandidateStatusEnum,
} from '../../api/searchApi';
import { NviSearchStatus, NviSearchStatusEnum } from '../../types/nvi.types';

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

/*
 * Takes in an array of statuses extracted from two different url attributes and translates it into the state that
 * should be shown in the UI (the status filter dropdown)
 * */
export const computeDropdownStatusFromParams = (
  status: NviCandidateStatus[] | null,
  globalStatus: NviCandidateGlobalStatus[] | null
) => {
  const selectedOptions = [];

  if (
    status?.includes(NviCandidateStatusEnum.Pending) &&
    globalStatus?.includes(NviCandidateGlobalStatusEnum.Pending)
  ) {
    selectedOptions.push(NviSearchStatusEnum.CandidatesForControl);
  }
  if (
    status?.includes(NviCandidateStatusEnum.Approved) &&
    (globalStatus?.includes(NviCandidateGlobalStatusEnum.Approved) ||
      globalStatus?.includes(NviCandidateGlobalStatusEnum.Pending))
  ) {
    selectedOptions.push(NviSearchStatusEnum.Approved);
  }
  if (
    status?.includes(NviCandidateStatusEnum.Rejected) &&
    (globalStatus?.includes(NviCandidateGlobalStatusEnum.Rejected) ||
      globalStatus?.includes(NviCandidateGlobalStatusEnum.Pending))
  ) {
    selectedOptions.push(NviSearchStatusEnum.Rejected);
  }
  return selectedOptions;
};

/*
 * Takes in the state that is shown in the UI (the status filter dropdown) and translates it into
 * two different url attributes used for API query
 * */
export const computeParamsFromDropdownStatus = (dropdownStatus: NviSearchStatus[]) => {
  const newStatus = new Set<NviCandidateStatus>([]);
  const newGlobalStatus = new Set<NviCandidateGlobalStatus>([]);

  dropdownStatus.forEach((value) => {
    if (value === NviSearchStatusEnum.CandidatesForControl) {
      newStatus.add(NviCandidateStatusEnum.Pending);
      newGlobalStatus.add(NviCandidateGlobalStatusEnum.Pending);
    } else if (value === NviSearchStatusEnum.Approved) {
      newStatus.add(NviCandidateStatusEnum.Approved);
      newGlobalStatus.add(NviCandidateGlobalStatusEnum.Approved);
      newGlobalStatus.add(NviCandidateGlobalStatusEnum.Pending);
    } else if (value === NviSearchStatusEnum.Rejected) {
      newStatus.add(NviCandidateStatusEnum.Rejected);
      newGlobalStatus.add(NviCandidateGlobalStatusEnum.Rejected);
      newGlobalStatus.add(NviCandidateGlobalStatusEnum.Pending);
    }
  });

  return { newStatuses: Array.from(newStatus), newGlobalStatuses: Array.from(newGlobalStatus) };
};
