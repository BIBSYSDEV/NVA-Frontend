import { Autocomplete, Box, Checkbox, Chip, FormControlLabel, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { defaultOrganizationSearchSize, fetchOrganization } from '../../../api/cristinApi';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { useSearchForOrganizations } from '../../../api/hooks/useSearchForOrganizations';
import { ResultParam } from '../../../api/searchApi';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { OrganizationRenderOption } from '../../../components/OrganizationRenderOption';
import { StyledFilterHeading } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { OrganizationHierarchyFilter } from './OrganizationHierarchyFilter';

interface OrganizationFiltersProps {
  topLevelOrganizationId: string | null;
  unitId: string | null;
}

export const OrganizationFilters = ({ topLevelOrganizationId, unitId }: OrganizationFiltersProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedQuery = useDebounce(searchTerm);
  const user = useSelector((store: RootState) => store.user);
  const params = new URLSearchParams(location.search);
  const excludeSubunits = params.get(ResultParam.ExcludeSubunits) === 'true';
  const topLevelOrgParam = params.get(ResultParam.TopLevelOrganization);
  const [showUnitSelection, setShowUnitSelection] = useState(false);
  const toggleShowUnitSelection = () => setShowUnitSelection(!showUnitSelection);

  const organizationQuery = useFetchOrganization(user?.topOrgCristinId ?? '');
  const userOrganization = organizationQuery.data;

  const topLevelOrganizationQuery = useQuery({
    enabled: !!topLevelOrganizationId,
    queryKey: ['organization', topLevelOrganizationId],
    queryFn: () => fetchOrganization(topLevelOrganizationId ?? ''),
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
  });

  const subUnitQuery = useQuery({
    enabled: !!unitId,
    queryKey: ['organization', unitId],
    queryFn: () => fetchOrganization(unitId ?? ''),
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
  });

  const [searchSize, setSearchSize] = useState(defaultOrganizationSearchSize);
  const organizationSearchQuery = useSearchForOrganizations({ query: debouncedQuery, results: searchSize });

  const defaultOptions = userOrganization ? [userOrganization] : [];
  const options = organizationSearchQuery.data?.hits ?? defaultOptions;

  const isLoading = topLevelOrganizationQuery.isFetching || organizationSearchQuery.isFetching;

  const handleCheckedExcludeSubunits = (event: ChangeEvent<HTMLInputElement>) => {
    const syncedParams = syncParamsWithSearchFields(params);
    if (topLevelOrgParam) {
      if (event.target.checked) {
        syncedParams.set(ResultParam.ExcludeSubunits, 'true');
      } else {
        syncedParams.delete(ResultParam.ExcludeSubunits);
      }
      syncedParams.delete(ResultParam.From);
    }

    navigate({ search: syncedParams.toString() });
  };

  return (
    <section>
      <StyledFilterHeading>{t('common.institution')}</StyledFilterHeading>
      <Box
        sx={{
          display: 'flex',
          gap: '0.5rem 1rem',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: { xs: 'start', lg: 'center' },
        }}>
        <Autocomplete
          fullWidth
          size="small"
          options={options}
          inputMode="search"
          sx={{ minWidth: '15rem' }}
          getOptionLabel={(option) => getLanguageString(option.labels)}
          getOptionKey={(option) => option.id}
          filterOptions={(options) => options}
          onInputChange={(_, value, reason) => {
            if (reason !== 'reset') {
              setSearchTerm(value);
            }
          }}
          onChange={(_, selectedInstitution) => {
            if (selectedInstitution !== topLevelOrganizationId) {
              const params = new URLSearchParams(location.search);
              if (selectedInstitution) {
                params.set(ResultParam.TopLevelOrganization, selectedInstitution.id);
              } else {
                params.delete(ResultParam.TopLevelOrganization);
                params.delete(ResultParam.ExcludeSubunits);
              }
              params.set(ResultParam.From, '0');
              params.delete(ResultParam.Unit);
              navigate({ search: params.toString() });
              setSearchTerm('');
            }
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          disabled={topLevelOrganizationQuery.isFetching}
          value={topLevelOrganizationQuery.data ?? null}
          loading={isLoading}
          renderOption={({ key, ...props }, option) => (
            <OrganizationRenderOption key={option.id} props={props} option={option} />
          )}
          ListboxComponent={AutocompleteListboxWithExpansion}
          ListboxProps={
            {
              hasMoreHits: !!organizationSearchQuery.data?.size && organizationSearchQuery.data.size > searchSize,
              onShowMoreHits: () => setSearchSize(searchSize + defaultOrganizationSearchSize),
              isLoadingMoreHits: organizationSearchQuery.isFetching && searchSize > options.length,
            } satisfies AutocompleteListboxWithExpansionProps as any
          }
          renderInput={(params) => (
            <AutocompleteTextField
              {...params}
              variant="outlined"
              multiline
              isLoading={isLoading}
              data-testid={dataTestId.organization.searchField}
              placeholder={t('project.search_for_institution')}
              showSearchIcon
            />
          )}
        />

        <Chip
          data-testid={dataTestId.organization.subSearchField}
          color="primary"
          onClick={toggleShowUnitSelection}
          label={
            unitId ? (
              subUnitQuery.isPending ? (
                <Skeleton sx={{ minWidth: '10rem' }} />
              ) : (
                getLanguageString(subUnitQuery.data?.labels)
              )
            ) : (
              <Box component="span" sx={{ textWrap: 'nowrap' }}>
                {t('common.select_unit')}
              </Box>
            )
          }
          onDelete={
            unitId
              ? () => {
                  params.delete(ResultParam.From);
                  params.delete(ResultParam.Unit);
                  navigate({ search: params.toString() });
                }
              : undefined
          }
          sx={{ minWidth: unitId ? '15rem' : undefined }}
          disabled={!topLevelOrganizationQuery.data?.hasPart || topLevelOrganizationQuery.data?.hasPart?.length === 0}
        />

        {topLevelOrganizationQuery.data && (
          <OrganizationHierarchyFilter
            organization={topLevelOrganizationQuery.data}
            open={showUnitSelection}
            onClose={toggleShowUnitSelection}
          />
        )}

        <FormControlLabel
          sx={{ whiteSpace: 'nowrap' }}
          control={
            <Checkbox
              disabled={!topLevelOrganizationId}
              onChange={handleCheckedExcludeSubunits}
              checked={!!topLevelOrganizationId && excludeSubunits}
            />
          }
          label={t('tasks.nvi.exclude_subunits')}
        />
      </Box>
    </section>
  );
};
