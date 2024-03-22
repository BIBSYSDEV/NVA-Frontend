import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchOrganizations } from '../../api/cristinApi';
import { fetchUser } from '../../api/roleApi';
import { TicketSearchParam } from '../../api/searchApi';
import { RootState } from '../../redux/store';
import { TicketStatus } from '../../types/publication_types/ticket.types';
import { getAllChildOrganizations } from '../institutions-helpers';
import { UrlPathTemplate } from '../urlPaths';

export const useSetDefaultTicketSearchParams = (): boolean => {
  const [defaultParamsAdded, setDefaultParamsAdded] = useState(false);

  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const nvaUsername = user?.nvaUsername ?? '';

  const history = useHistory();
  const isOnTasksPage = history.location.pathname === UrlPathTemplate.TasksDialogue;

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
    if (!isOnTasksPage || !organizationQuery.data || defaultParamsAdded || history.location.search) {
      return;
    }

    const organizations = organizationQuery.data;
    const organizationsWithSubUnits = getAllChildOrganizations(organizations);

    const searchParams = new URLSearchParams(history.location.search);
    searchParams.set(TicketSearchParam.ViewingScope, organizationsWithSubUnits.map((org) => org.id).join(','));
    searchParams.set(TicketSearchParam.Assignee, nvaUsername);
    searchParams.set(TicketSearchParam.Status, 'Pending' as TicketStatus);
    history.push({ search: searchParams.toString() });

    setDefaultParamsAdded(true);
  }, [organizationQuery.data, history, nvaUsername, defaultParamsAdded, isOnTasksPage]);

  return defaultParamsAdded;
};
