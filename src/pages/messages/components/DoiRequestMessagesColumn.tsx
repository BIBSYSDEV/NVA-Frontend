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

interface DoiRequestMessagesColumnProps {
  ticket: ExpandedTicket | Ticket;
  withColor?: boolean;
  showDetails?: boolean;
}

export const DoiRequestMessagesColumn = ({ ticket, showDetails, withColor }: DoiRequestMessagesColumnProps) => {
  const { t } = useTranslation();

  return (
    <StyledMessagesContainer>
      {ticket.status === 'New' || ticket.status === 'Pending' ? (
        <StyledStatusMessageBox sx={withColor ? { bgcolor: 'info.light' } : {}}>
          <StyledIconAndTextWrapper>
            <HourglassEmptyIcon fontSize="small" />
            <Typography>{t('my_page.messages.doi_pending')}</Typography>
          </StyledIconAndTextWrapper>
        </StyledStatusMessageBox>
      ) : ticket.status === 'Completed' ? (
        <StyledStatusMessageBox sx={withColor ? { bgcolor: 'neutral87.main' } : {}}>
          <StyledIconAndTextWrapper>
            <CheckIcon fontSize="small" />
            <Typography>{t('my_page.messages.doi_completed')}</Typography>
          </StyledIconAndTextWrapper>
          {ticket.modifiedDate && <Typography>{toDateString(ticket.modifiedDate)}</Typography>}
        </StyledStatusMessageBox>
      ) : ticket.status === 'Closed' ? (
        <StyledStatusMessageBox sx={withColor ? { bgcolor: 'warning.light' } : {}}>
          <StyledIconAndTextWrapper>
            <BlockIcon fontSize="small" />
            <Typography>{t('my_page.messages.doi_closed')}</Typography>
          </StyledIconAndTextWrapper>
          {ticket.modifiedDate && <Typography>{toDateString(ticket.modifiedDate)}</Typography>}
        </StyledStatusMessageBox>
      ) : null}

      {showDetails && <LastMessageBox ticket={ticket as ExpandedTicket} />}
    </StyledMessagesContainer>
  );
};
