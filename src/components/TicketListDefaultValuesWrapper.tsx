import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TicketSearchParam } from '../api/searchApi';
import { RootState } from '../redux/store';
import { TicketStatus } from '../types/publication_types/ticket.types';

interface TicketListDefaultValuesWrapperProps {
  children: ReactNode;
}

export const TicketListDefaultValuesWrapper = ({ children }: TicketListDefaultValuesWrapperProps) => {
  const user = useSelector((store: RootState) => store.user);
  const nvaUsername = user?.nvaUsername ?? '';

  const history = useHistory();

  useEffect(() => {
    if (history.location.search) {
      return;
    }

    const searchParams = new URLSearchParams(history.location.search);
    searchParams.set(TicketSearchParam.Assignee, nvaUsername);
    searchParams.set(TicketSearchParam.Status, 'Pending' as TicketStatus);
    history.push({ search: searchParams.toString() });
  }, [history, nvaUsername]);

  return <>{children}</>;
};
