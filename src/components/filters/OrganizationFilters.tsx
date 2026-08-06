import { Checkbox, FormControlLabel } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { ResultParam } from '../../api/searchApi';
import { syncParamsWithSearchFields } from '../../utils/searchHelpers';
import { HorizontalBoxResponsive, StyledFilterHeading } from '../styled/Wrappers';
import { OrganizationUnitSelector } from './organization-unit-selector/OrganizationUnitSelector';
import { OrganizationAutocomplete } from './OrganizationAutocomplete';

/**
 * Filters for selecting organization.
 *
 * Renders a search field, a chip for narrowing down to a sub-unit, and an "exclude subunits" checkbox.
 *
 * Reads the current filter state from the URL query params and writes back to them on change, using
 * {@link ResultParam.TopLevelOrganization}, {@link ResultParam.Unit} and {@link ResultParam.ExcludeSubunits}.
 */
export const OrganizationFilters = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const excludeSubunits = params.get(ResultParam.ExcludeSubunits) === 'true';
  const topLevelOrganizationId = params.get(ResultParam.TopLevelOrganization);
  const unitId = params.get(ResultParam.Unit);
  const unidentifiedContributorInstitutionParam = params.get(ResultParam.UnidentifiedContributorInstitution);

  const topLevelOrganizationQuery = useFetchOrganization(topLevelOrganizationId);

  const handleCheckedExcludeSubunits = (event: ChangeEvent<HTMLInputElement>) => {
    const syncedParams = syncParamsWithSearchFields(params);
    if (topLevelOrganizationId) {
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
