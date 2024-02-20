import { Box, Chip, Divider, Theme, useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { FetchResultsParams, ResultParam, SortOrder, fetchResults } from '../../../api/searchApi';
import { CategoryChip } from '../../../components/CategorySelector';
import { SearchForm } from '../../../components/SearchForm';
import { PublicationInstanceType } from '../../../types/registration.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { ExportResultsButton } from '../ExportResultsButton';
import { PublicationDateIntervalFilter } from '../PublicationDateIntervalFilter';
import { RegistrationSearch } from '../registration_search/RegistrationSearch';
import { CategoryFilterDialog } from './CategoryFilterDialog';
import { FundingSourceFilter } from './FundingSourceFilter';
import { JournalFilter } from './JournalFilter';
import { OrganizationFilters } from './OrganizationFilters';
import { PublisherFilter } from './PublisherFilter';
import { SeriesFilter } from './SeriesFilter';

export const AdvancedSearchPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const showFilterDivider = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

  const [openCategoryFilter, setOpenCategoryFilter] = useState(false);
  const toggleCategoryFilter = () => setOpenCategoryFilter(!openCategoryFilter);

  const params = new URLSearchParams(location.search);

  const categoryShould = (params.get(ResultParam.CategoryShould)?.split(',') as PublicationInstanceType[] | null) ?? [];
  const topLevelOrganizationId = params.get(ResultParam.TopLevelOrganization);
  const unitId = params.get(ResultParam.Unit);

  const resultSearchQueryConfig: FetchResultsParams = {
    categoryShould,
    contributorName: params.get(ResultParam.ContributorName),
    from: Number(params.get(ResultParam.From) ?? 0),
    fundingIdentifier: params.get(ResultParam.FundingIdentifier),
    fundingSource: params.get(ResultParam.FundingSource),
    journal: params.get(ResultParam.Journal),
    order: params.get(ResultParam.Order),
    publicationYearBefore: params.get(ResultParam.PublicationYearBefore),
    publicationYearSince: params.get(ResultParam.PublicationYearSince),
    publisher: params.get(ResultParam.Publisher),
    results: Number(params.get(ResultParam.Results) ?? ROWS_PER_PAGE_OPTIONS[0]),
    series: params.get(ResultParam.Series),
    sort: params.get(ResultParam.Sort) as SortOrder | null,
    title: params.get(ResultParam.Title),
    topLevelOrganization: topLevelOrganizationId,
    unit: unitId,
  };

  const resultSearchQuery = useQuery({
    queryKey: ['registrations', resultSearchQueryConfig],
    queryFn: () => fetchResults(resultSearchQueryConfig),
    meta: { errorMessage: t('feedback.error.search') },
    keepPreviousData: true,
  });

  return (
    <section>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          mx: { xs: '0.5rem', md: 0 },
          mb: '0.75rem',
        }}>
        <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <SearchForm
            sx={{ flex: '1 0 15rem' }}
            paramName={ResultParam.Title}
            placeholder={t('search.search_for_title')}
          />
          <ExportResultsButton searchParams={params} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <PublicationDateIntervalFilter />

          {showFilterDivider && <Divider orientation="vertical" flexItem />}

          <OrganizationFilters topLevelOrganizationId={topLevelOrganizationId} unitId={unitId} />

          {showFilterDivider && <Divider orientation="vertical" flexItem />}

          <SearchForm paramName={ResultParam.ContributorName} placeholder={t('search.search_for_contributor')} />

          {showFilterDivider && <Divider orientation="vertical" flexItem />}

          <FundingSourceFilter />

          {showFilterDivider && <Divider orientation="vertical" flexItem />}

          <SearchForm
            paramName={ResultParam.FundingIdentifier}
            placeholder={t('search.search_for_funding_identifier')}
          />

          {showFilterDivider && <Divider orientation="vertical" flexItem />}

          <PublisherFilter />

          {showFilterDivider && <Divider orientation="vertical" flexItem />}

          <JournalFilter />

          {showFilterDivider && <Divider orientation="vertical" flexItem />}

          <SeriesFilter />

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
