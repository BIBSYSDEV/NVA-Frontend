import { Box, Chip, FormLabel } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { FetchResultsParams, ResultParam, fetchResults } from '../../../api/searchApi';
import { BetaFunctionality } from '../../../components/BetaFunctionality';
import { SearchForm } from '../../../components/SearchForm';
import { SortSelector } from '../../../components/SortSelector';
import { RegistrationFieldName } from '../../../types/publicationFieldNames';
import { PublicationInstanceType } from '../../../types/registration.types';
import { CategoryChip } from '../../registration/resource_type_tab/components/RegistrationTypesRow';
import { RegistrationSearch } from '../registration_search/RegistrationSearch';
import { CategoryFilterDialog } from './CategoryFilterDialog';
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

  const categoryShould = (params.get(ResultParam.CategoryShould)?.split(',') as PublicationInstanceType[] | null) ?? [];
  const institutionId = params.get(AdvancedSearchQueryParams.Institution);
  const subUnitId = params.get(AdvancedSearchQueryParams.SubUnit);

  const unitFilter = subUnitId ?? institutionId;

  const resultSearchQueryConfig: FetchResultsParams = {
    title: params.get(ResultParam.Title),
    unit: unitFilter,
    categoryShould,
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

      <div>
        <FormLabel component="legend" sx={{ mb: '0.25rem' }}>
          {t('registration.resource_type.resource_type')}
        </FormLabel>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
          {categoryShould.length > 0 ? (
            categoryShould.map((category) => (
              <CategoryChip
                key={category}
                category={{
                  value: category,
                  text: t(`registration.publication_types.${category}`),
                  selected: true,
                }}
                onClickChip={toggleCategoryFilter}
              />
            ))
          ) : (
            <Chip
              label={t('registration.resource_type.select_resource_type')}
              color="primary"
              onClick={toggleCategoryFilter}
            />
          )}
        </Box>
        <CategoryFilterDialog
          open={openCategoryFilter}
          currentCategories={categoryShould}
          closeDialog={toggleCategoryFilter}
        />
      </div>

      <RegistrationSearch registrationQuery={resultSearchQuery} />
    </Box>
  );
};
