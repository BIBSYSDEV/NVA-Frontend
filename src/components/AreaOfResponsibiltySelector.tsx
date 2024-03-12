import { Autocomplete, Checkbox, Chip, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchOrganization } from '../api/cristinApi';
import { fetchUser } from '../api/roleApi';
import { TicketSearchParam } from '../api/searchApi';
import { RootState } from '../redux/store';
import { Organization } from '../types/organization.types';
import { dataTestId } from '../utils/dataTestIds';
import { getLanguageString } from '../utils/translation-helpers';

interface OrganizationOption extends Organization {
  level: number;
}

function buildOrganizationOptions(topLevelOrganizations: Organization[]): OrganizationOption[] {
  const options: OrganizationOption[] = [];
  topLevelOrganizations.forEach((org) => buildOrganizationOption(org, 0, options));
  return options;
}

function buildOrganizationOption(org: Organization, level: number, options: OrganizationOption[]): void {
  options.push({ ...org, level: level });
  if (org.hasPart?.length) {
    org.hasPart.forEach((org) => buildOrganizationOption(org, level + 1, options));
  }
}

export const AreaOfResponsibilitySelector = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const nvaUsername = user?.nvaUsername ?? '';

  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

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
    queryFn: async () => {
      const areaPromises = areasOfResponsibilityIds.map(async (orgId) => {
        return await fetchOrganization(orgId);
      });
      const organizations = await Promise.all(areaPromises);
      const organizationOptions = buildOrganizationOptions(organizations);
      if (!searchParams.get(TicketSearchParam.ViewingScope)) {
        searchParams.set(TicketSearchParam.ViewingScope, organizationOptions.map((org) => org.id).join(','));
        history.push({ search: searchParams.toString() });
      }
      return organizationOptions;
    },
    meta: { errorMessage: t('feedback.error.get_institution') },
  });
  const organizationOptions = organizationQuery.data ?? [];

  const selectedAreaIdsFromUrl = searchParams.get(TicketSearchParam.ViewingScope)?.split(',');
  const selectedOrganizations = organizationOptions.filter((org) => selectedAreaIdsFromUrl?.includes(org.id));

  return (
    <Autocomplete
      multiple
      autoHighlight
      options={organizationOptions}
      value={selectedOrganizations}
      disableCloseOnSelect
      disableClearable
      disabled={organizationQuery.isLoading}
      loading={organizationQuery.isLoading}
      getOptionLabel={(option) => getLanguageString(option.labels)}
      renderTags={(values) => (
        <Chip
          sx={{ py: '0.1rem' }}
          label={t('common.chosen', { count: values.length })}
          color="primary"
          size="small"
          variant="filled"
          data-testid={dataTestId.registrationWizard.resourceType.journalChip}
          onDelete={() => {
            searchParams.delete(TicketSearchParam.ViewingScope);
            history.push({ search: searchParams.toString() });
          }}
        />
      )}
      onChange={(_, values) => {
        if (values.length) {
          searchParams.set(TicketSearchParam.ViewingScope, values.map((org) => org.id).join(','));
        } else {
          searchParams.delete(TicketSearchParam.ViewingScope);
        }
        history.push({ search: searchParams.toString() });
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.id}>
          <Checkbox sx={{ ml: `${option.level}rem`, mr: '0.5rem' }} checked={selected} size="small" />
          {getLanguageString(option.labels)}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          data-testid={dataTestId.tasksPage.areaOfResponsibilitySelector}
          size="small"
          label={t('editor.curators.area_of_responsibility')}
          placeholder={t('common.search')}
        />
      )}
    />
  );
};
