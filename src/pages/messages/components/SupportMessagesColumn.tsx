import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ExpandedTicket } from '../../../types/publication_types/ticket.types';
import { LastMessageBox } from './LastMessageBox';
import {
  StyledIconAndTextWrapper,
  StyledMessagesContainer,
  StyledStatusMessageBox,
} from './PublishingRequestMessagesColumn';

interface SupportMessagesColumnProps {
  ticket: ExpandedTicket;
}

export const SupportMessagesColumn = ({ ticket }: SupportMessagesColumnProps) => {
  const { t } = useTranslation();

  return (
    <StyledMessagesContainer>
      <StyledStatusMessageBox sx={{ bgcolor: 'generalSupportCase.main' }}>
        <StyledIconAndTextWrapper>
          <ChatBubbleOutlineOutlinedIcon fontSize="small" />
          <Typography>{t('my_page.messages.types.GeneralSupportCase')}</Typography>
        </StyledIconAndTextWrapper>
      </StyledStatusMessageBox>

      {(ticket.status === 'New' || ticket.status === 'Pending') && (
        <StyledStatusMessageBox sx={{ bgcolor: 'secondary.dark' }}>
          <StyledIconAndTextWrapper>
            <HourglassEmptyIcon fontSize="small" />
            <Typography>{t('my_page.messages.general_support_pending')}</Typography>
          </StyledIconAndTextWrapper>
        </StyledStatusMessageBox>
      )}
      <LastMessageBox ticket={ticket} />
    </StyledMessagesContainer>
  );
};
