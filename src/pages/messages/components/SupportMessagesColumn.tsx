import { Typography } from '@mui/material';
import { ExpandedTicket } from '../../../types/publication_types/messages.types';
import { StyledMessagesContainer, StyledStatusMessageBox } from './PublishingRequestMessagesColumn';
import { TruncatableTypography } from '../../../components/TruncatableTypography';

interface SupportMessagesColumnProps {
  ticket: ExpandedTicket;
}

export const SupportMessagesColumn = ({ ticket }: SupportMessagesColumnProps) => {
  const lastMessage = ticket.messages.at(-1);

  const lastSender = lastMessage
    ? `${lastMessage.sender.preferredFirstName || lastMessage.sender.firstName} ${
        lastMessage.sender.preferredLastName || lastMessage.sender.lastName
      }`.trim()
    : '';

  return (
    <StyledMessagesContainer>
      {lastMessage ? (
        <StyledStatusMessageBox sx={{ bgcolor: 'generalSupportCase.main' }}>
          <Typography>{lastSender}</Typography>
          <Typography>{new Date(lastMessage.createdDate).toLocaleDateString()}</Typography>
          <TruncatableTypography lines={5} sx={{ gridColumn: '1/3' }}>
            {lastMessage.text}
          </TruncatableTypography>
        </StyledStatusMessageBox>
      ) : null}
    </StyledMessagesContainer>
  );
};
