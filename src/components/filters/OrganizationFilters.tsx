import { Checkbox, FormControlLabel } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { fetchOrganization } from '../../api/cristinApi';
import { ResultParam } from '../../api/searchApi';
import { syncParamsWithSearchFields } from '../../utils/searchHelpers';
import { HorizontalBoxResponsive, StyledFilterHeading } from '../styled/Wrappers';
import { OrganizationUnitSelector } from './organization-unit-selector/OrganizationUnitSelector';
import { OrganizationAutocomplete } from './OrganizationAutocomplete';

interface OrganizationFiltersProps {
  topLevelOrganizationId: string | null;
  unitId: string | null;
}

export const OrganizationFilters = ({ topLevelOrganizationId, unitId }: OrganizationFiltersProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const excludeSubunits = params.get(ResultParam.ExcludeSubunits) === 'true';
  const topLevelOrgParam = params.get(ResultParam.TopLevelOrganization);
  const unidentifiedContributorInstitutionParam = params.get(ResultParam.UnidentifiedContributorInstitution);

  const topLevelOrganizationQuery = useQuery({
    enabled: !!topLevelOrganizationId,
    queryKey: ['organization', topLevelOrganizationId],
    queryFn: () => fetchOrganization(topLevelOrganizationId ?? ''),
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
  });

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
      <HorizontalBoxResponsive sx={{ gap: '0.5rem 1rem' }}>
        <OrganizationAutocomplete
          topLevelOrganizationId={topLevelOrganizationId}
          unidentifiedContributorInstitutionParam={unidentifiedContributorInstitutionParam}
          topLevelOrganizationQuery={topLevelOrganizationQuery}
        />
        <OrganizationUnitSelector unitId={unitId} topLevelOrganizationQuery={topLevelOrganizationQuery} />

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
      </HorizontalBoxResponsive>
    </section>
  );
};
