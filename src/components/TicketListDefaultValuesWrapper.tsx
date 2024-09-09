import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { TicketSearchParam } from '../api/searchApi';
import { RootState } from '../redux/store';
import { TicketStatus } from '../types/publication_types/ticket.types';

interface TicketListDefaultValuesWrapperProps {
  children: ReactNode;
}

const defaultStatusFilterItems: TicketStatus[] = ['New', 'Pending'];

export const TicketListDefaultValuesWrapper = ({ children }: TicketListDefaultValuesWrapperProps) => {
  const user = useSelector((store: RootState) => store.user);
  const nvaUsername = user?.nvaUsername ?? '';

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.search) {
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    if (nvaUsername) {
      searchParams.set(TicketSearchParam.Assignee, nvaUsername);
    }
    searchParams.set(TicketSearchParam.Status, defaultStatusFilterItems.join(','));
    navigate({ search: searchParams.toString() });
  }, [navigate, location.search, nvaUsername]);

  return children;
};
