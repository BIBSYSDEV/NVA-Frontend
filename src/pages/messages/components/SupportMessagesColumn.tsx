import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ExpandedTicket } from '../../../types/publication_types/ticket.types';
import { LastMessageBox } from './LastMessageBox';
import { StyledMessagesContainer, StyledStatusMessageBox } from './PublishingRequestMessagesColumn';

interface SupportMessagesColumnProps {
  ticket: ExpandedTicket;
}

export const SupportMessagesColumn = ({ ticket }: SupportMessagesColumnProps) => {
  const { t } = useTranslation();

  return (
    <StyledMessagesContainer>
      {ticket.status === 'New' || ticket.status === 'Pending' ? (
        <>
          <LastMessageBox ticket={ticket} />
          <StyledStatusMessageBox sx={{ bgcolor: 'secondary.dark' }}>
            <Typography>{t('my_page.messages.general_support_pending')}</Typography>
          </StyledStatusMessageBox>
        </>
      ) : (
        <LastMessageBox ticket={ticket} />
      )}
    </StyledMessagesContainer>
  );
};
