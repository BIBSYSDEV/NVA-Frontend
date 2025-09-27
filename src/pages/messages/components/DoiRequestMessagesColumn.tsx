import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ExpandedTicket, Ticket } from '../../../types/publication_types/ticket.types';
import { toDateString } from '../../../utils/date-helpers';
import { LastMessageBox } from './LastMessageBox';
import {
  StyledIconAndTextWrapper,
  StyledMessagesContainer,
  StyledStatusMessageBox,
} from './PublishingRequestMessagesColumn';
import { ticketStatusColor } from './SupportMessagesColumn';

interface DoiRequestMessagesColumnProps {
  ticket: ExpandedTicket | Ticket;
  showDetails?: boolean;
}

export const DoiRequestMessagesColumn = ({ ticket, showDetails }: DoiRequestMessagesColumnProps) => {
  const { t } = useTranslation();

  return (
    <StyledMessagesContainer>
      {showDetails && (
        <StyledStatusMessageBox sx={{ bgcolor: ticketStatusColor[ticket.status], width: 'fit-content' }}>
          <StyledIconAndTextWrapper>
            <AddLinkOutlinedIcon fontSize="small" />
            <Typography color="white">{t('my_page.messages.types.DoiRequest')}</Typography>
          </StyledIconAndTextWrapper>
        </StyledStatusMessageBox>
      )}

      {ticket.status === 'New' || ticket.status === 'Pending' ? (
        <StyledStatusMessageBox sx={{ bgcolor: 'info.main' }}>
          <StyledIconAndTextWrapper>
            <HourglassEmptyIcon fontSize="small" />
            <Typography color="white">{t('my_page.messages.doi_pending')}</Typography>
          </StyledIconAndTextWrapper>
        </StyledStatusMessageBox>
      ) : ticket.status === 'Completed' ? (
        <StyledStatusMessageBox sx={{ bgcolor: 'success.main' }}>
          <StyledIconAndTextWrapper>
            <CheckIcon fontSize="small" />
            <Typography color="white">{t('my_page.messages.doi_completed')}</Typography>
          </StyledIconAndTextWrapper>
          {ticket.modifiedDate && <Typography color="white">{toDateString(ticket.modifiedDate)}</Typography>}
        </StyledStatusMessageBox>
      ) : ticket.status === 'Closed' ? (
        <StyledStatusMessageBox sx={{ bgcolor: 'error.main' }}>
          <StyledIconAndTextWrapper>
            <BlockIcon fontSize="small" />
            <Typography color="white">{t('my_page.messages.doi_closed')}</Typography>
          </StyledIconAndTextWrapper>
          {ticket.modifiedDate && <Typography color="white">{toDateString(ticket.modifiedDate)}</Typography>}
        </StyledStatusMessageBox>
      ) : null}

      {showDetails && <LastMessageBox ticket={ticket as ExpandedTicket} />}
    </StyledMessagesContainer>
  );
};
