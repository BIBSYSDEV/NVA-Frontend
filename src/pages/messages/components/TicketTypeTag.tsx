import { TicketType } from '../../../types/publication_types/ticket.types';
import { getTicketColor, getTicketTypeIcon } from '../utils';
import { useTicketTypeText } from '../../../utils/hooks/useTicketTypeText';
import { HorizontalBox } from '../../../components/styled/Wrappers';

interface TicketTypeTagProps {
  type: TicketType;
  noText?: boolean;
  count?: number;
}

export const TicketTypeTag = ({ type, noText = false, count = -1 }: TicketTypeTagProps) => {
  const text = useTicketTypeText(type);
  const showText = !noText;

  return (
    <HorizontalBox
      sx={{ bgcolor: getTicketColor(type), gap: '0.25rem', padding: '0rem 0.2rem', borderRadius: '0.25rem' }}>
      {getTicketTypeIcon(type)}
      {showText && count > -1 ? `${text} (${count})` : showText ? text : null}
    </HorizontalBox>
  );
};
