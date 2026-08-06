import { Checkbox, FormControlLabel } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { ResultParam } from '../../api/searchApi';
import { Organization } from '../../types/organization.types';
import { syncParamsWithSearchFields } from '../../utils/searchHelpers';
import { HorizontalBoxResponsive, StyledFilterHeading } from '../styled/Wrappers';
import { OrganizationUnitSelector } from './organization-unit-selector/OrganizationUnitSelector';
import { OrganizationAutocomplete } from './OrganizationAutocomplete';

interface OrganizationFiltersProps {
  onTopLevelOrganizationChange?: (selectedOrganization: Organization | null, syncedParams: URLSearchParams) => void;
}

/**
 * Filters for selecting organization.
 *
 * Renders a search field, a chip for narrowing down to a sub-unit, and an "exclude subunits" checkbox.
 *
 * Reads the current filter state from the URL query params and writes back to them on change, using
 * {@link ResultParam.TopLevelOrganization}, {@link ResultParam.Unit} and {@link ResultParam.ExcludeSubunits}.
 */
export const OrganizationFilters = ({ onTopLevelOrganizationChange }: OrganizationFiltersProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const topLevelOrganizationId = params.get(ResultParam.TopLevelOrganization);
  const unitId = params.get(ResultParam.Unit);
  const excludeSubunits = params.get(ResultParam.ExcludeSubunits) === 'true';

  const topLevelOrganizationQuery = useFetchOrganization(topLevelOrganizationId);

  const handleChangeTopLevelOrganization = (selectedInstitution: Organization | null) => {
    const syncedParams = syncParamsWithSearchFields(params);
    if (selectedInstitution) {
      syncedParams.set(ResultParam.TopLevelOrganization, selectedInstitution.id);

      // This was introduced because of a special need from NVI Correction Lists to sync with other url params - earlier that
      // was handled here, but now, to keep it generic, we accept a callback, so the exceptions are handled by the caller instead
      onTopLevelOrganizationChange?.(selectedInstitution, syncedParams);
    } else {
      syncedParams.delete(ResultParam.TopLevelOrganization);
      syncedParams.delete(ResultParam.ExcludeSubunits);
    }
    syncedParams.delete(ResultParam.From);
    syncedParams.delete(ResultParam.Unit);

    navigate({ search: syncedParams.toString() });
  };

  const handleChangeUnit = (newUnitId: string | null) => {
    const syncedParams = syncParamsWithSearchFields(params);
    if (newUnitId) {
      syncedParams.set(ResultParam.Unit, newUnitId);
    } else {
      syncedParams.delete(ResultParam.Unit);
    }
    syncedParams.delete(ResultParam.From);
    navigate({ search: syncedParams.toString() });
  };

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
          value={topLevelOrganizationQuery.data ?? null}
          valueIsLoading={topLevelOrganizationQuery.isFetching}
          onChange={handleChangeTopLevelOrganization}
        />
        <OrganizationUnitSelector
          parentOrganization={topLevelOrganizationQuery.data ?? null}
          value={unitId}
          onChange={handleChangeUnit}
        />
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
