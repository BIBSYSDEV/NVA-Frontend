import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { ResultParam } from '../../api/searchApi';
import { Organization } from '../../types/organization.types';
import { resetPagination } from '../../utils/searchHelpers';
import { HorizontalBoxResponsive, StyledFilterHeading } from '../styled/Wrappers';
import { ExcludeSubunitsCheckbox } from './ExcludeSubunitsCheckbox';
import { OrganizationUnitSelector } from './organization-unit-selector/OrganizationUnitSelector';
import { OrganizationAutocomplete } from './OrganizationAutocomplete';

interface OrganizationFiltersProps {
  onTopLevelOrganizationChange?: (selectedOrganization: Organization | null, syncedParams: URLSearchParams) => void; // Optional callback that lets callers piggyback additional param updates after top level organization change.
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

  const topLevelOrganizationQuery = useFetchOrganization(topLevelOrganizationId);

  const handleChangeTopLevelOrganization = (selectedInstitution: Organization | null) => {
    if (selectedInstitution?.id === topLevelOrganizationId) {
      return;
    }
    const syncedParams = resetPagination(params);
    if (selectedInstitution) {
      syncedParams.set(ResultParam.TopLevelOrganization, selectedInstitution.id);
    } else {
      syncedParams.delete(ResultParam.TopLevelOrganization);
      syncedParams.delete(ResultParam.ExcludeSubunits);
    }
    syncedParams.delete(ResultParam.Unit);

    onTopLevelOrganizationChange?.(selectedInstitution, syncedParams);
    navigate({ search: syncedParams.toString() });
  };

  const handleChangeUnit = (newUnitId: string | null) => {
    const syncedParams = resetPagination(params);
    if (newUnitId) {
      syncedParams.set(ResultParam.Unit, newUnitId);
    } else {
      syncedParams.delete(ResultParam.Unit);
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
        <ExcludeSubunitsCheckbox
          paramName={ResultParam.ExcludeSubunits}
          paginationParamName={ResultParam.From}
          disabled={!topLevelOrganizationId}
        />
      </HorizontalBoxResponsive>
    </section>
  );
};
