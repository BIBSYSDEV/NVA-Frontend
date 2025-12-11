import { UseQueryResult } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import { CustomerTicketSearchResponse, TicketTypeSelection } from '../../types/publication_types/ticket.types';
import { InstitutionUser } from '../../types/user.types';

export interface TasksContextObject {
  institutionUserQuery: UseQueryResult<InstitutionUser, Error>;
  ticketsQuery: UseQueryResult<CustomerTicketSearchResponse, Error>;
  ticketTypes: TicketTypeSelection;
  setTicketTypes: (types: TicketTypeSelection) => void;
}

export const TasksContext = createContext<TasksContextObject | null>(null);

export const useTasksContext = () => {
  const tasksContext = useContext(TasksContext);
  if (!tasksContext) {
    throw new Error('TasksContext.Provider is missing');
  }
  return {
    institutionUserQuery: tasksContext.institutionUserQuery,
    ticketsQuery: tasksContext.ticketsQuery,
    ticketTypes: tasksContext.ticketTypes,
    setTicketTypes: tasksContext.setTicketTypes,
  };
};
