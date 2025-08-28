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
      {(ticket.status === 'New' || ticket.status === 'Pending') && (
        <StyledStatusMessageBox>
          <StyledIconAndTextWrapper>
            <HourglassEmptyIcon fontSize="small" />
            <Typography color="white">{t('my_page.messages.general_support_pending')}</Typography>
          </StyledIconAndTextWrapper>
        </StyledStatusMessageBox>
      )}
      <LastMessageBox ticket={ticket} />
    </StyledMessagesContainer>
  );
};
