import { Box, Button, Dialog } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { FetchResultsParams, ResultParam, fetchResults } from '../../../api/searchApi';
import { BetaFunctionality } from '../../../components/BetaFunctionality';
import { SearchForm } from '../../../components/SearchForm';
import { SortSelector } from '../../../components/SortSelector';
import { RegistrationFieldName } from '../../../types/publicationFieldNames';
import { RegistrationSearch } from '../registration_search/RegistrationSearch';
import { CategoryFilter } from './CategoryFilter';
import { OrganizationFilters } from './OrganizationFilters';

export enum AdvancedSearchQueryParams {
  Institution = 'institution',
  SubUnit = 'subUnit',
}

export const AdvancedSearchPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [openCategoryFilter, setOpenCategoryFilter] = useState(false);
  const toggleCategoryFilter = () => setOpenCategoryFilter(!openCategoryFilter);

  const params = new URLSearchParams(location.search);

  const institutionId = params.get(AdvancedSearchQueryParams.Institution);
  const subUnitId = params.get(AdvancedSearchQueryParams.SubUnit);

  const unitFilter = subUnitId ?? institutionId;

  const resultSearchQueryConfig: FetchResultsParams = {
    title: params.get(ResultParam.Title),
    unit: unitFilter,
  };

  const resultSearchQuery = useQuery({
    queryKey: ['registrations', resultSearchQueryConfig],
    queryFn: () => fetchResults(resultSearchQueryConfig),
    meta: { errorMessage: t('feedback.error.search') },
    keepPreviousData: true,
  });

  return (
    <Box component={BetaFunctionality} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <SearchForm sx={{ width: '100%' }} paramName={ResultParam.Title} placeholder={t('search.search_for_title')} />
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

      <OrganizationFilters institutionId={institutionId} subUnitId={subUnitId} />

      <Button variant="outlined" onClick={toggleCategoryFilter}>
        Velg kategori
      </Button>
      <Dialog open={openCategoryFilter} onClose={toggleCategoryFilter} maxWidth="md">
        <CategoryFilter />
      </Dialog>

      <RegistrationSearch registrationQuery={resultSearchQuery} />
    </Box>
  );
};
