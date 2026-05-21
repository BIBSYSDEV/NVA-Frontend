import { useTranslation } from 'react-i18next';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { StatusChip, StatusValue } from './StatusChip';

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
    return <StatusChip status={StatusValue.Completed} text={text} />;
  }

  if (ticket.status === 'Closed') {
    return <StatusChip status={StatusValue.Closed} text={text} />;
  }

  return <StatusChip status={StatusValue.InProgress} text={text} />;
};
