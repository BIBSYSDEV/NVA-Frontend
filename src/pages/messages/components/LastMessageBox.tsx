import { Typography } from '@mui/material';
import { TruncatableTypography } from '../../../components/TruncatableTypography';
import { ExpandedTicket } from '../../../types/publication_types/ticket.types';
import { toDateString } from '../../../utils/date-helpers';
import { StyledStatusMessageBox } from './PublishingRequestMessagesColumn';

interface LastMessageBoxProps {
  ticket: ExpandedTicket;
}

export const LastMessageBox = ({ ticket }: LastMessageBoxProps) => {
  const lastMessage = ticket.messages.at(-1);

  if (!lastMessage) {
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
      : ticket.type === 'PublishingRequest'
        ? 'publishingRequest.main'
        : ticket.type === 'DoiRequest'
          ? 'doiRequest.main'
          : undefined;

  return (
    <StyledStatusMessageBox sx={{ bgcolor: ticketColor }}>
      <Typography>{senderName}</Typography>
      <Typography>{toDateString(lastMessage.createdDate)}</Typography>
      <TruncatableTypography lines={5} sx={{ gridColumn: '1/-1' }}>
        {lastMessage.text}
      </TruncatableTypography>
    </StyledStatusMessageBox>
  );
};
