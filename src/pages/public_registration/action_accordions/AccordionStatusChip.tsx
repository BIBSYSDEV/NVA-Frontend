import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Box, Typography } from '@mui/material';
import { StandardCSSProperties } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { NviCandidateStatus } from '../../../types/nvi.types';
import { TicketStatus } from '../../../types/publication_types/ticket.types';

interface TicketStatusChipProps {
  ticketStatus: TicketStatus;
  completedColor: StandardCSSProperties['backgroundColor'];
}

export const TicketStatusChip = ({ ticketStatus, completedColor }: TicketStatusChipProps) => {
  const { t } = useTranslation();

  if (ticketStatus === 'NotApplicable' || !ticketStatus) {
    return null;
  }

  const icon = ticketStatus === 'Completed' ? 'check' : ticketStatus === 'Closed' ? 'block' : 'hourglass';
  const color = ticketStatus === 'Completed' ? completedColor : 'secondary.dark';

  return <StatusChip text={t(`my_page.messages.ticket_types.${ticketStatus}`)} icon={icon} color={color} />;
};

interface NviStatusChip {
  status: NviCandidateStatus;
}

export const NviStatusChip = ({ status }: NviStatusChip) => {
  const { t } = useTranslation();

  const icon = status === 'Approved' ? 'check' : status === 'Rejected' ? 'block' : 'hourglass';

  return (
    <StatusChip
      text={t(`tasks.nvi.status.${status}`)}
      icon={icon}
      color={status === 'Approved' ? 'nvi.main' : 'secondary.dark'}
    />
  );
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
