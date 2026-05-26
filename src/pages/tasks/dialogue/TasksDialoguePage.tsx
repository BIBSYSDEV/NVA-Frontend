import { UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';
import { TicketListDefaultValuesWrapper } from '../../../components/TicketListDefaultValuesWrapper';
import { CustomerTicketSearchResponse } from '../../../types/publication_types/ticket.types';
import { TicketList } from '../../messages/components/TicketList';

interface TasksDialoguePageContext {
  ticketsQuery: UseQueryResult<CustomerTicketSearchResponse>;
  selectedTicketTypes: string[];
}

export const TasksDialoguePage = () => {
  const { t } = useTranslation();
  const { ticketsQuery, selectedTicketTypes } = useOutletContext<TasksDialoguePageContext>();

  return (
    <TicketListDefaultValuesWrapper>
      <TicketList
        ticketsQuery={ticketsQuery}
        title={t('tasks.user_dialog')}
        selectedTicketTypes={selectedTicketTypes}
      />
    </TicketListDefaultValuesWrapper>
  );
};

export default TasksDialoguePage;
