import { Box } from '@mui/material';
import { TicketType } from '../../../types/publication_types/ticket.types';
import { getTicketColor, getTicketTypeIcon } from '../utils';
import { useTicketTypeText } from '../../../utils/hooks/useTicketTypeText';

interface TicketTypeTagProps {
  type: TicketType;
  noText?: boolean;
  count?: number;
}

export const TicketTypeTag = ({ type, noText = false, count = -1 }: TicketTypeTagProps) => {
  const text = useTicketTypeText(type);
  const showText = !noText;

  return (
    <Box
      sx={{
        bgcolor: getTicketColor(type),
        display: 'flex',
        gap: '0.25rem',
        alignItems: 'center',
        padding: '0rem 0.2rem',
        borderRadius: '0.25rem',
      }}>
      {getTicketTypeIcon(type)}
      {showText && count > -1 ? `${text} (${count})` : showText ? text : null}
    </Box>
  );
};
