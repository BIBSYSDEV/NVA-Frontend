import { useTranslation } from 'react-i18next';
import { StatusChip, StatusValue } from '../../../components/_molecules/status-chip/StatusChip';
import { Ticket } from '../../../types/publication_types/ticket.types';

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
    return <StatusChip text={text} status={StatusValue.Completed} />;
  }

  if (ticket.status === 'Closed') {
    return <StatusChip text={text} status={StatusValue.Closed} />;
  }

  return <StatusChip text={text} status={StatusValue.InProgress} />;
};
