import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../api/roleApi';
import { fetchOrganizations } from '../api/cristinApi';
import { getAllChildOrganizations } from '../utils/institutions-helpers';
import { TicketSearchParam } from '../api/searchApi';
import { TicketStatus } from '../types/publication_types/ticket.types';

interface TicketListDefaultValuesWrapperProps {
  children: ReactNode;
}

export const TicketListDefaultValuesWrapper = ({ children }: TicketListDefaultValuesWrapperProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const nvaUsername = user?.nvaUsername ?? '';

  const history = useHistory();

  const institutionUserQuery = useQuery({
    enabled: !!nvaUsername,
    queryKey: ['user', nvaUsername],
    queryFn: () => fetchUser(nvaUsername),
    meta: { errorMessage: t('feedback.error.get_person') },
  });
  const areasOfResponsibilityIds = institutionUserQuery.data?.viewingScope?.includedUnits ?? [];

  const organizationQuery = useQuery({
    enabled: areasOfResponsibilityIds.length > 0,
    queryKey: ['organizations', areasOfResponsibilityIds],
    queryFn: async () => fetchOrganizations(areasOfResponsibilityIds),
    meta: { errorMessage: t('feedback.error.get_institution') },
  });

  useEffect(() => {
    if (!organizationQuery.data || history.location.search) {
      return;
    }

    const organizations = organizationQuery.data;
    const organizationsWithSubUnits = getAllChildOrganizations(organizations);

    const searchParams = new URLSearchParams(history.location.search);
    searchParams.set(TicketSearchParam.ViewingScope, organizationsWithSubUnits.map((org) => org.id).join(','));
    searchParams.set(TicketSearchParam.Assignee, nvaUsername);
    searchParams.set(TicketSearchParam.Status, 'Pending' as TicketStatus);
    history.push({ search: searchParams.toString() });
  }, [organizationQuery.data, history, nvaUsername]);

  return <>{children}</>;
};
