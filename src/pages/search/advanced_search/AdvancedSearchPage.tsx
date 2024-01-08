import { Box, Chip, Divider, Theme, useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { FetchResultsParams, ResultParam, SortOrder, fetchResults } from '../../../api/searchApi';
import { SearchForm } from '../../../components/SearchForm';
import { SortSelector } from '../../../components/SortSelector';
import { RegistrationFieldName } from '../../../types/publicationFieldNames';
import { PublicationInstanceType } from '../../../types/registration.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
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
  const showFilterDivider = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

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
    sort: params.get(ResultParam.Sort) as SortOrder | null,
    order: params.get(ResultParam.Order),
    from: Number(params.get(ResultParam.From) ?? 0),
    results: Number(params.get(ResultParam.Results) ?? ROWS_PER_PAGE_OPTIONS[0]),
  };

  const resultSearchQuery = useQuery({
    queryKey: ['registrations', resultSearchQueryConfig],
    queryFn: () => fetchResults(resultSearchQueryConfig),
    meta: { errorMessage: t('feedback.error.search') },
    keepPreviousData: true,
  });

  return (
    <section>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mx: { xs: '0.5rem', md: 0 }, mb: '0.75rem' }}>
        <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <SearchForm
            sx={{ flex: '1 0 15rem' }}
            paramName={ResultParam.Title}
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <OrganizationFilters institutionId={institutionId} subUnitId={subUnitId} />

          {showFilterDivider && <Divider orientation="vertical" flexItem />}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {categoryShould.slice(0, 3).map((category) => (
              <CategoryChip
                key={category}
                category={{
                  value: category,
                  text: t(`registration.publication_types.${category}`),
                  selected: true,
                }}
                onClickChip={toggleCategoryFilter}
              />
            ))}
            {categoryShould.length > 3 ? (
              <Chip
                label={t('common.x_others', { count: categoryShould.length - 3 })}
                variant="filled"
                color="primary"
                onClick={toggleCategoryFilter}
              />
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
        </Box>
      </Box>

      <RegistrationSearch registrationQuery={resultSearchQuery} />
    </section>
  );
};
