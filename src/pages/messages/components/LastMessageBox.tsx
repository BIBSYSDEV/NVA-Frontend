import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { ExpandedTicket } from '../../../types/publication_types/ticket.types';
import { toDateString } from '../../../utils/date-helpers';
import { isFileApprovalTicket } from '../../../utils/ticketHelpers';
import { StyledStatusMessageBox } from './PublishingRequestMessagesColumn';

interface LastMessageBoxProps {
  ticket: ExpandedTicket;
}

export const LastMessageBox = ({ ticket }: LastMessageBoxProps) => {
  const user = useSelector((store: RootState) => store.user);
  const lastMessage = ticket.messages.at(-1);

  if (!lastMessage) {
    return null;
  }

  if (ticket.status === 'Completed' && ticket.viewedBy.some((viewer) => viewer.username === user?.nvaUsername)) {
    return null;
  }

  const senderName = lastMessage
    ? `${lastMessage.sender.preferredFirstName || lastMessage.sender.firstName} ${
        lastMessage.sender.preferredLastName || lastMessage.sender.lastName
      }`.trim()
    : '';

  const ticketColor =
    ticket.type === 'GeneralSupportCase'
      ? 'generalSupportCase.main'
      : isFileApprovalTicket(ticket)
        ? 'publishingRequest.main'
        : ticket.type === 'DoiRequest'
          ? 'doiRequest.main'
          : undefined;

  return (
    <StyledStatusMessageBox sx={{ bgcolor: 'info.main' }}>
      <Typography color="white" noWrap>
        {senderName}
      </Typography>
      <Typography color="white">{toDateString(lastMessage.createdDate)}</Typography>
      <Typography
        sx={{
          gridColumn: '1/-1',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          color: 'white',
        }}>
        {lastMessage.text}
      </Typography>
    </StyledStatusMessageBox>
  );
};
