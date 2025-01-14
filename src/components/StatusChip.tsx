import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Box, Typography } from '@mui/material';
import { StandardCSSProperties } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { NviCandidateStatus } from '../types/nvi.types';
import { Ticket } from '../types/publication_types/ticket.types';

const ticketColor = {
  PublishingRequest: 'publishingRequest.main',
  DoiRequest: 'doiRequest.main',
  GeneralSupportCase: 'generalSupportCase.main',
};

interface TicketStatusChipProps {
  ticket: Ticket;
}

export const TicketStatusChip = ({ ticket }: TicketStatusChipProps) => {
  const { t } = useTranslation();

  if (ticket.status === 'NotApplicable' || ticket.type === 'UnpublishRequest') {
    return null;
  }

  const text = t(`my_page.messages.ticket_types.${ticket.status}`);

  if (ticket.status === 'Completed') {
    return <StatusChip text={text} icon="check" color={ticketColor[ticket.type]} />;
  }

  return <StatusChip text={text} icon={ticket.status === 'Closed' ? 'block' : 'hourglass'} color="secondary.dark" />;
};

interface NviStatusChip {
  status: NviCandidateStatus;
}

export const NviStatusChip = ({ status }: NviStatusChip) => {
  const { t } = useTranslation();

  const text = t(`tasks.nvi.status.${status}`);

  if (status === 'Approved') {
    return <StatusChip text={text} icon="check" color="nvi.main" />;
  }

  return <StatusChip text={text} icon={status === 'Rejected' ? 'block' : 'hourglass'} color="secondary.dark" />;
};

interface StatusChipProps {
  text: string;
  icon: 'check' | 'block' | 'hourglass';
  color?: StandardCSSProperties['color'];
}

export const StatusChip = ({ text, color, icon }: StatusChipProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '0.2rem',
        alignItems: 'center',
        bgcolor: color ?? 'secondary.dark',
        p: '0.25rem 0.5rem',
        borderRadius: '1rem',
      }}>
      {icon === 'check' ? (
        <CheckIcon sx={{ fontSize: '1rem' }} />
      ) : icon === 'block' ? (
        <BlockIcon sx={{ fontSize: '1rem' }} />
      ) : icon === 'hourglass' ? (
        <HourglassEmptyIcon sx={{ fontSize: '1rem' }} />
      ) : null}
      <Typography>{text}</Typography>
    </Box>
  );
};
