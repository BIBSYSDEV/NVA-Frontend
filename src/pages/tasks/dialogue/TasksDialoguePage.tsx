import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';
import { UseQueryResult } from '@tanstack/react-query';
import { TicketListDefaultValuesWrapper } from '../../../components/TicketListDefaultValuesWrapper';
import { CustomerTicketSearchResponse } from '../../../types/publication_types/ticket.types';
import { TicketList } from '../../messages/components/TicketList';

export const TasksDialoguePage = () => {
  const { t } = useTranslation();
  const { ticketsQuery } = useOutletContext<{ ticketsQuery: UseQueryResult<CustomerTicketSearchResponse> }>();

  return (
    <TicketListDefaultValuesWrapper>
      <TicketList ticketsQuery={ticketsQuery} title={t('tasks.user_dialog')} />
    </TicketListDefaultValuesWrapper>
  );
};

export default TasksDialoguePage;
