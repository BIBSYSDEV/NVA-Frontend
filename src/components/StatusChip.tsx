import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NviCandidateStatus } from '../types/nvi.types';
import { Ticket } from '../types/publication_types/ticket.types';

interface TicketStatusChipProps {
  ticket: Pick<Ticket, 'status' | 'type'>;
}

export const TicketStatusChip = ({ ticket }: TicketStatusChipProps) => {
  const { t } = useTranslation();

  if (ticket.status === 'NotApplicable' || ticket.type === 'UnpublishRequest') {
    return null;
  }

  const text = t(`my_page.messages.ticket_types.${ticket.status}`);

  if (ticket.status === 'Completed') {
    return <StatusChip bgcolor="success.main" text={text} icon="check" />;
  }

  return (
    <StatusChip
      bgcolor={ticket.status === 'Closed' ? 'error.main' : undefined}
      text={text}
      icon={ticket.status === 'Closed' ? 'block' : 'hourglass'}
    />
  );
};

interface NviStatusChip {
  status: NviCandidateStatus;
}

export const NviStatusChip = ({ status }: NviStatusChip) => {
  const { t } = useTranslation();

  const text = t(`tasks.nvi.status.${status}`);

  if (status === 'Approved') {
    return <StatusChip text={text} icon="check" bgcolor="success.main" />;
  }

  return (
    <StatusChip
      text={text}
      icon={status === 'Rejected' ? 'block' : 'hourglass'}
      bgcolor={status === 'Rejected' ? 'error.main' : 'info.main'}
    />
  );
};

interface StatusChipProps {
  text: string;
  icon: 'check' | 'block' | 'hourglass';
  bgcolor?: string;
  paddingY?: string | number;
}

export const StatusChip = ({ text, bgcolor = 'info.main', icon, paddingY }: StatusChipProps) => {
  return (
    <Box
      sx={{
        width: 'fit-content',
        height: 'fit-content',
        display: 'flex',
        gap: '0.2rem',
        alignItems: 'center',
        p: '0.25rem 0.75rem 0.25rem 0.5rem',
        borderRadius: '1rem',
        bgcolor,
        paddingY,
        color: 'white',
      }}>
      {icon === 'check' ? (
        <CheckIcon sx={{ fontSize: '1rem' }} />
      ) : icon === 'block' ? (
        <BlockIcon sx={{ fontSize: '1rem' }} />
      ) : icon === 'hourglass' ? (
        <HourglassEmptyIcon sx={{ fontSize: '1rem' }} />
      ) : null}
      <Typography color="white">{text}</Typography>
    </Box>
  );
};
