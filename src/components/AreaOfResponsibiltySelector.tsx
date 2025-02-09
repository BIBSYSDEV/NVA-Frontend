import { Autocomplete, BaseTextFieldProps, Checkbox, Chip, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { fetchOrganizations } from '../api/cristinApi';
import { useFetchUserQuery } from '../api/hooks/useFetchUserQuery';
import { RootState } from '../redux/store';
import { Organization } from '../types/organization.types';
import { dataTestId } from '../utils/dataTestIds';
import { syncParamsWithSearchFields } from '../utils/searchHelpers';
import { getLanguageString } from '../utils/translation-helpers';

interface OrganizationOption extends Organization {
  level: number;
}

function buildOrganizationOptions(topLevelOrganizations: Organization[]): OrganizationOption[] {
  return topLevelOrganizations.flatMap((org) => buildOrganizationOption(org, 0));
}

function buildOrganizationOption(org: Organization, level: number): OrganizationOption[] {
  const option = { ...org, level };
  const subOptions = org.hasPart?.flatMap((subOrg) => buildOrganizationOption(subOrg, level + 1)) || [];
  return [option, ...subOptions];
}

interface AreaOfResponsibilitySelectorProps extends Pick<BaseTextFieldProps, 'sx'> {
  paramName: string;
  resetPagination: (params: URLSearchParams) => void;
}

export const AreaOfResponsibilitySelector = ({ sx, paramName, resetPagination }: AreaOfResponsibilitySelectorProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const institutionUserQuery = useFetchUserQuery(user?.nvaUsername ?? '');
  const areasOfResponsibilityIds = institutionUserQuery.data?.viewingScope?.includedUnits ?? [];

  const organizationQuery = useQuery({
    enabled: areasOfResponsibilityIds.length > 0,
    queryKey: ['organizations', areasOfResponsibilityIds],
    queryFn: async () => fetchOrganizations(areasOfResponsibilityIds),
    meta: { errorMessage: t('feedback.error.get_institution') },
  });
  const organizations = organizationQuery.data ?? [];
  const organizationOptions = buildOrganizationOptions(organizations);

  const selectedAreaIdsFromUrl = searchParams.get(paramName)?.split(',');
  const selectedOrganizations = organizationOptions.filter(
    (org) => org.identifier && selectedAreaIdsFromUrl?.includes(org.identifier)
  );

  const onlyOneAreaOfResponsibilitySelectable = organizationOptions.length === 1;

  return onlyOneAreaOfResponsibilitySelectable ? (
    <TextField
      sx={sx}
      size="small"
      fullWidth
      disabled
      defaultValue={getLanguageString(organizationOptions[0].labels)}
      title={getLanguageString(organizationOptions[0].labels)}
      label={t('editor.curators.area_of_responsibility')}
      slotProps={{ htmlInput: { style: { overflow: 'hidden', textOverflow: 'ellipsis' } } }}
    />
  ) : (
    <Autocomplete
      sx={sx}
      multiple
      autoHighlight
      options={organizationOptions}
      value={selectedOrganizations}
      disableCloseOnSelect
      disableClearable
      disabled={organizationQuery.isPending}
      loading={organizationQuery.isPending}
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
            const syncedParams = syncParamsWithSearchFields(searchParams);
            syncedParams.delete(paramName);
            resetPagination(syncedParams);
            navigate({ search: syncedParams.toString() });
          }}
        />
      )}
      onChange={(_, values) => {
        const syncedParams = syncParamsWithSearchFields(searchParams);
        if (values.length) {
          syncedParams.set(paramName, values.map((org) => org.identifier).join(','));
        } else {
          syncedParams.delete(paramName);
        }
        resetPagination(syncedParams);
        navigate({ search: syncedParams.toString() });
      }}
      renderOption={({ key, ...props }, option, { selected }) => (
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
