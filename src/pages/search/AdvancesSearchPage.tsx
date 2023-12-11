import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { FetchResultsParams, ResultParam, fetchResults } from '../../api/searchApi';
import { BetaFunctionality } from '../../components/BetaFunctionality';
import { SearchForm } from '../../components/SearchForm';
import { SortSelector } from '../../components/SortSelector';
import { RegistrationFieldName } from '../../types/publicationFieldNames';
import { RegistrationSearch } from '../search/registration_search/RegistrationSearch';

export const AdvancedSearchPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const resultSearchQueryConfig: FetchResultsParams = {
    title: params.get(ResultParam.Title),
  };

  const resultSearchQuery = useQuery({
    queryKey: ['registrations', resultSearchQueryConfig],
    queryFn: () => fetchResults(resultSearchQueryConfig),
    meta: { errorMessage: t('feedback.error.search') },
    keepPreviousData: true,
  });

  return (
    <BetaFunctionality>
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <SearchForm
          sx={{ width: '100%' }}
          paramName={ResultParam.Title}
          label={t('common.title')}
          placeholder={t('search.search_for_title')}
        />
        <SortSelector
          options={[
            {
              orderBy: RegistrationFieldName.ModifiedDate,
              sortOrder: 'desc',
              label: t('search.sort_by_modified_date'),
            },
            {
              orderBy: RegistrationFieldName.PublishedDate,
              sortOrder: 'desc',
              label: t('search.sort_by_published_date_desc'),
            },
            {
              orderBy: RegistrationFieldName.PublishedDate,
              sortOrder: 'asc',
              label: t('search.sort_by_published_date_asc'),
            },
          ]}
          sortKey="sort"
          orderKey="order"
        />
      </Box>

      <RegistrationSearch registrationQuery={resultSearchQuery} />
    </BetaFunctionality>
  );
};
