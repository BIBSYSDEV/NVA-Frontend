import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useRegistrationSearch } from '../../../api/hooks/useRegistrationSearch';
import { ResultParam } from '../../../api/searchApi';
import { CategorySearchFilter } from '../../../components/CategorySearchFilter';
import { HeadTitle } from '../../../components/HeadTitle';
import { CorrectionListId } from '../../../types/nvi.types';
import { useCorrectionListConfig } from '../../../utils/hooks/useCorrectionListConfig';
import { useRegistrationsQueryParams } from '../../../utils/hooks/useRegistrationSearchParams';
import { sanitizeSearchParams } from '../../../utils/searchHelpers';
import { JournalFilter } from '../../search/advanced_search/JournalFilter';
import { OrganizationFilters } from '../../search/advanced_search/OrganizationFilters';
import { PublisherFilter } from '../../search/advanced_search/PublisherFilter';
import { SeriesFilter } from '../../search/advanced_search/SeriesFilter';
import { ExportResultsButton } from '../../search/ExportResultsButton';
import { RegistrationSearch } from '../../search/registration_search/RegistrationSearch';
import { CorrectionListYearFilter } from './CorrectionListYearFilter';

export const nviCorrectionListQueryKey = 'list';

export const NviCorrectionList = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const listId = searchParams.get(nviCorrectionListQueryKey) as CorrectionListId | null;
  const correctionListConfig = useCorrectionListConfig();
  const listConfig = listId && correctionListConfig[listId];

  const registrationParams = useRegistrationsQueryParams();
  const exportParams = new URLSearchParams(sanitizeSearchParams({ ...listConfig?.queryParams, ...registrationParams }));

  const registrationQuery = useRegistrationSearch({
    enabled: !!listConfig,
    params: {
      ...listConfig?.queryParams,
      ...registrationParams,
      unit: registrationParams.unit ?? registrationParams.topLevelOrganization,
    },
  });

  return (
    <section>
      <HeadTitle>{t('tasks.correction_list')}</HeadTitle>

      {listConfig && (
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
                  topLevelOrganizationId={registrationParams.topLevelOrganization ?? null}
                  unitId={registrationParams.unit ?? null}
                />
                <Divider flexItem orientation="vertical" sx={{ bgcolor: 'primary.main' }} />
                <CategorySearchFilter
                  searchParam={ResultParam.CategoryShould}
                  disabled={listConfig.disabledFilters.includes(ResultParam.CategoryShould)}
                />
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 1rem' }}>
                <PublisherFilter />
                <JournalFilter />
                <SeriesFilter />
                <Divider flexItem orientation="vertical" sx={{ bgcolor: 'primary.main' }} />
                <CorrectionListYearFilter />
              </Box>
            </Box>
            <Box sx={{ m: '0.5rem', alignSelf: 'top' }}>
              <ExportResultsButton showText searchParams={exportParams} />
            </Box>
          </Box>

          <RegistrationSearch registrationQuery={registrationQuery} />
        </>
      )}
    </section>
  );
};
