import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchOrganizations } from '../api/cristinApi';
import { fetchUser } from '../api/roleApi';
import { TicketSearchParam } from '../api/searchApi';
import { RootState } from '../redux/store';
import { Organization } from '../types/organization.types';
import { TicketStatus } from '../types/publication_types/ticket.types';

interface TicketListDefaultValueWrapperProps {
  children: ReactNode;
}

function flattenOrganizationsWithSubunits(topLevelOrganizations: Organization[]): Organization[] {
  return topLevelOrganizations.flatMap((org) => flattenOrganizationWithSubunits(org));
}

function flattenOrganizationWithSubunits(org: Organization): Organization[] {
  const subUnits = org.hasPart?.flatMap((subOrg) => flattenOrganizationWithSubunits(subOrg)) || [];
  return [org, ...subUnits];
}

export const TicketListDefaultValueWrapper = ({ children }: TicketListDefaultValueWrapperProps) => {
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
    if (!organizationQuery.data) {
      return;
    }

    const searchParams = new URLSearchParams(history.location.search);

    const organizations = organizationQuery.data;
    const organizationsWithSubUnits = flattenOrganizationsWithSubunits(organizations);
    if (!searchParams.get(TicketSearchParam.ViewingScope)) {
      searchParams.set(TicketSearchParam.ViewingScope, organizationsWithSubUnits.map((org) => org.id).join(','));
    }

    if (!searchParams.get(TicketSearchParam.Assignee)) {
      searchParams.set(TicketSearchParam.Assignee, nvaUsername);
    }

    if (!searchParams.get(TicketSearchParam.Status)) {
      searchParams.set(TicketSearchParam.Status, 'Pending' as TicketStatus);
    }

    history.push({ search: searchParams.toString() });
  }, [organizationQuery.data, history, nvaUsername]);

  return <>{children}</>;
};
