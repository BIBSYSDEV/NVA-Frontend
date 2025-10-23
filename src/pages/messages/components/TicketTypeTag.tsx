import { TicketType } from '../../../types/publication_types/ticket.types';
import { useTicketTypeText } from '../../../utils/hooks/useTicketTypeText';
import { HorizontalBox } from '../../../components/styled/Wrappers';
import { getTicketColor, getTicketTypeIcon } from '../utils';

interface TicketTypeTagProps {
  type: TicketType;
  showText?: boolean;
  count?: number;
}

export const TicketTypeTag = ({ type, showText = true, count }: TicketTypeTagProps) => {
  const text = useTicketTypeText(type);

  return (
    <HorizontalBox
      aria-label={text}
      sx={{ bgcolor: getTicketColor(type), gap: '0.25rem', padding: '0rem 0.2rem', borderRadius: '0.25rem' }}>
      {getTicketTypeIcon(type)}
      {showText && count !== undefined ? `${text} (${count})` : showText ? text : null}
    </HorizontalBox>
  );
};
