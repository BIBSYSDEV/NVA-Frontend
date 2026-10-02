import { Box, Divider, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useRegistrationSearch } from '../../../api/hooks/useRegistrationSearch';
import { ResultParam } from '../../../api/searchApi';
import { CategorySearchFilter } from '../../../components/CategorySearchFilter';
import { OrganizationFilters } from '../../../components/filters/OrganizationFilters';
import { HeadTitle } from '../../../components/HeadTitle';
import { CorrectionListNames, nviCorrectionListQueryKey } from '../../../types/nvi.types';
import {
  getCommonCorrectionListConfig,
  isCorrectionListName,
  setPublicationYearParams,
} from '../../../utils/correctionListHelpers';
import { useCorrectionListConfig } from '../../../utils/hooks/useCorrectionListConfig';
import { useRegistrationsQueryParams } from '../../../utils/hooks/useRegistrationSearchParams';
import { sanitizeSearchParams } from '../../../utils/searchHelpers';
import NotFound from '../../errorpages/NotFound';
import { JournalFilter } from '../../search/advanced_search/JournalFilter';
import { PublisherFilter } from '../../search/advanced_search/PublisherFilter';
import { ScientificValueFilter } from '../../search/advanced_search/ScientificValueFilter';
import { SeriesFilter } from '../../search/advanced_search/SeriesFilter';
import { ExportResultsButton } from '../../search/ExportResultsButton';
import { RegistrationSearch } from '../../search/registration_search/RegistrationSearch';
import { CorrectionListYearFilter } from './CorrectionListYearFilter';

const NviCorrectionList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rawListId = searchParams.get(nviCorrectionListQueryKey);
  const listId = rawListId && isCorrectionListName(rawListId) ? rawListId : null;
  const isUnidentifiedContributorList = listId === CorrectionListNames.UnidentifiedContributorWithIdentifiedAffiliation;
  const correctionListConfig = useCorrectionListConfig();
  const listConfig = listId && correctionListConfig[listId];

  const registrationParams = useRegistrationsQueryParams();

  // A list without a "show all" option has no valid state without a year: its search would silently
  // return every hit the other filters allow. Repair the url rather than only displaying a default,
  // so the year the user sees is the year being searched for
  const requiresPublicationYear = !!listConfig && !listConfig.showAllYearsOption;
  const isMissingRequiredYear = requiresPublicationYear && !registrationParams.publicationYear;

  useEffect(() => {
    if (!isMissingRequiredYear) {
      return;
    }
    const syncedParams = new URLSearchParams(location.search);
    // Writing to the url re-runs this effect; this is not a loop because after one run the year is set
    setPublicationYearParams(syncedParams, listId, getCommonCorrectionListConfig().publicationYear);
    navigate({ search: syncedParams.toString() }, { replace: true });
  }, [isMissingRequiredYear, listId, location.search, navigate]);

  const mergedParams = {
    ...listConfig?.queryParams,
    ...registrationParams,
    unit: registrationParams.unit ?? registrationParams.topLevelOrganization,
    // unidentifiedContributorInstitution should always be the same as topLevelOrganization because its's chosen in the same dropdown
    ...(isUnidentifiedContributorList && {
      unidentifiedContributorInstitution: registrationParams.topLevelOrganization,
    }),
  };
  const exportParams = new URLSearchParams(sanitizeSearchParams(mergedParams));

  const registrationQuery = useRegistrationSearch({
    enabled: !!listConfig && !isMissingRequiredYear,
    params: mergedParams,
  });

  if (rawListId && !listId) {
    return <NotFound />;
  }

  return (
    <section>
      <HeadTitle>{t('tasks.correction_list')}</HeadTitle>

      {listConfig && !isMissingRequiredYear && (
        <>
          <Typography variant="h1" gutterBottom sx={{ mx: { xs: '0.25rem', md: 0 } }}>
            {t(listConfig.i18nKey)}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
              mb: '1rem',
            }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', px: { xs: '0.5rem', md: 0 }, gap: '0.5rem' }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <OrganizationFilters
                  // The "unidentified contributor with identified affiliation" correction list filters on unidentifiedContributorInstitution.
                  // It should stay in sync with whichever institution is selected, for as long as this list is active
                  onTopLevelOrganizationChange={
                    isUnidentifiedContributorList
                      ? (selectedOrganization, syncedParams) => {
                          if (selectedOrganization) {
                            syncedParams.set(ResultParam.UnidentifiedContributorInstitution, selectedOrganization.id);
                          } else {
                            syncedParams.delete(ResultParam.UnidentifiedContributorInstitution);
                          }
                        }
                      : undefined
                  }
                />
                <Divider flexItem orientation="vertical" sx={{ bgcolor: 'primary.main' }} />
                <CategorySearchFilter
                  searchParam={ResultParam.CategoryShould}
                  disabled={listConfig.disabledFilters.includes(ResultParam.CategoryShould)}
                  disabledCategories={listConfig.disabledCategories}
                />
              </Box>

              {listConfig.showScientificValueFilter && <ScientificValueFilter />}

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 1rem' }}>
                {listConfig.showChannelFilters && (
                  <>
                    <PublisherFilter />
                    <JournalFilter />
                    <SeriesFilter />
                    <Divider flexItem orientation="vertical" sx={{ bgcolor: 'primary.main' }} />
                  </>
                )}
                <CorrectionListYearFilter showAllYearsOption={listConfig.showAllYearsOption} />
              </Box>
            </Box>
            <Box sx={{ m: '0.5rem', alignSelf: 'top' }}>
              <ExportResultsButton showText searchParams={exportParams} />
            </Box>
          </Box>

          <RegistrationSearch registrationQuery={registrationQuery} searchResultNavigationParams={mergedParams} />
        </>
      )}
    </section>
  );
};

export default NviCorrectionList;
