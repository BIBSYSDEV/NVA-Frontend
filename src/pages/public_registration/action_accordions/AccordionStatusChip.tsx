import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Box, Typography } from '@mui/material';
import { StandardCSSProperties } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { TicketStatus } from '../../../types/publication_types/ticket.types';

interface AccordionStatusChipProps {
  ticketStatus: TicketStatus;
  completedColor: StandardCSSProperties['backgroundColor'];
  overrideText?: string;
}

export const AccordionStatusChip = ({ ticketStatus, completedColor, overrideText }: AccordionStatusChipProps) => {
  const { t } = useTranslation();

  if (ticketStatus === 'NotApplicable') {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '0.2rem',
        alignItems: 'center',
        bgcolor: ticketStatus === 'Completed' ? completedColor : 'secondary.dark',
        p: '0.25rem 0.5rem',
        borderRadius: '1rem',
      }}>
      {ticketStatus === 'Completed' ? (
        <CheckIcon sx={{ fontSize: '1rem' }} />
      ) : ticketStatus === 'Closed' ? (
        <BlockIcon sx={{ fontSize: '1rem' }} />
      ) : (
        <HourglassEmptyIcon sx={{ fontSize: '1rem' }} />
      )}
      <Typography>{overrideText ?? t(`my_page.messages.ticket_types.${ticketStatus}`)}</Typography>
    </Box>
  );
};
