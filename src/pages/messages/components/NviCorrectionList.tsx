import { Box, Divider, MenuItem, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useRegistrationSearch } from '../../../api/hooks/useRegistrationSearch';
import { ResultParam } from '../../../api/searchApi';
import { CategorySearchFilter } from '../../../components/CategorySearchFilter';
import { HeadTitle } from '../../../components/HeadTitle';
import { StyledFilterHeading } from '../../../components/styled/Wrappers';
import { CorrectionListId } from '../../../types/nvi.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useCorrectionListConfig } from '../../../utils/hooks/useCorrectionListConfig';
import { useRegistrationsQueryParams } from '../../../utils/hooks/useRegistrationSearchParams';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { JournalFilter } from '../../search/advanced_search/JournalFilter';
import { OrganizationFilters } from '../../search/advanced_search/OrganizationFilters';
import { PublisherFilter } from '../../search/advanced_search/PublisherFilter';
import { SeriesFilter } from '../../search/advanced_search/SeriesFilter';
import { RegistrationSearch } from '../../search/registration_search/RegistrationSearch';

export const nviCorrectionListQueryKey = 'list';

const currentYear = new Date().getFullYear();

const options = [
  { value: (currentYear + 1).toString(), label: `${currentYear + 1}` },
  { value: currentYear.toString(), label: `${currentYear}` },
  { value: 'showAll', label: `Show All` },
];

export const NviCorrectionList = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const listId = searchParams.get(nviCorrectionListQueryKey) as CorrectionListId | null;
  const correctionListConfig = useCorrectionListConfig();
  const listConfig = listId && correctionListConfig[listId];

  const registrationParams = useRegistrationsQueryParams();
  const [selectedValue, setSelectedValue] = useState<string>(registrationParams.publicationYear ?? '');

  const registrationQuery = useRegistrationSearch({
    enabled: !!listConfig,
    params: {
      ...listConfig?.queryParams,
      ...registrationParams,
      unit: registrationParams.unit ?? registrationParams.topLevelOrganization,
    },
  });

  const navigate = useNavigate();

  return (
    <section>
      <HeadTitle>{t('tasks.correction_list')}</HeadTitle>

      {listConfig && (
        <>
          <Typography variant="h1" gutterBottom sx={{ mx: { xs: '0.25rem', md: 0 } }}>
            {t(listConfig.i18nKey)}
          </Typography>

          <Box
            sx={{ px: { xs: '0.5rem', md: 0 }, display: 'flex', flexDirection: 'column', gap: '0.5rem', mb: '1rem' }}>
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
              <Box>
                <StyledFilterHeading>{t('basic_data.nvi.period_year')}</StyledFilterHeading>
                <TextField
                  sx={{ minWidth: '7rem' }}
                  select
                  data-testid={dataTestId.tasksPage.nvi.yearSelect}
                  size="small"
                  value={selectedValue}
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    setSelectedValue(selectedValue);
                    const syncedParams = syncParamsWithSearchFields(searchParams);
                    if (selectedValue !== 'showAll') {
                      syncedParams.set(ResultParam.PublicationYear, selectedValue.toString());
                    } else {
                      syncedParams.delete(ResultParam.PublicationYear);
                    }
                    navigate({ search: syncedParams.toString() });
                  }}
                  slotProps={{
                    htmlInput: {
                      'aria-label': t('basic_data.nvi.period_year'),
                    },
                  }}>
                  {options.map((option) => {
                    return (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Box>
            </Box>
          </Box>

          <RegistrationSearch registrationQuery={registrationQuery} />
        </>
      )}
    </section>
  );
};
