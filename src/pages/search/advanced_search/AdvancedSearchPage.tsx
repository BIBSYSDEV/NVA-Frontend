import { Box, Button, Chip, Divider, Grid, SxProps, Theme, Typography, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
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
import { LanguageFilter } from './LanguageFilter';
import { OrganizationFilters } from './OrganizationFilters';
import { PublisherFilter } from './PublisherFilter';
import { SeriesFilter } from './SeriesFilter';

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const StyledFilterContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
}));

const gridItemStyles: SxProps = { display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: '1rem' };

export const AdvancedSearchPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const showFilterDivider = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const history = useHistory();

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
    publicationLanguageShould: params.get(ResultParam.PublicationLanguageShould),
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

  const clearSearchParams = () => {
    history.push({
      pathname: location.pathname,
    });
  };

  return (
    <Grid container sx={{ bgcolor: 'secondary.main' }}>
      <Grid
        item
        container
        rowGap={1}
        sx={{
          mx: { xs: '0.5rem', md: 0 },
          mb: '0.75rem',
          p: '1rem',
        }}>
        <Typography variant="h3">{t('search.advanced_search.advanced_search')}</Typography>
        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <StyledFilterContainer>
            <Typography fontWeight="bold">{t('search.advanced_search.title_search')}</Typography>
            <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <SearchForm
                sx={{ flex: '1 0 15rem' }}
                paramName={ResultParam.Title}
                placeholder={t('search.search_for_title')}
              />
              <ExportResultsButton searchParams={params} />
            </Box>
          </StyledFilterContainer>
          <StyledDivider sx={{ mb: '0.5rem' }} />
        </Grid>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <Grid item xs={12} sx={gridItemStyles}>
            <StyledFilterContainer sx={{ width: 'fit-content' }}>
              <Typography fontWeight="bold">{t('search.advanced_search.publishing_period')}</Typography>
              <PublicationDateIntervalFilter />
            </StyledFilterContainer>

            {showFilterDivider && <StyledDivider orientation="vertical" flexItem />}

            <StyledFilterContainer>
              <Typography fontWeight="bold">{t('common.category')}</Typography>
              <section>
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
              </section>
            </StyledFilterContainer>

            {showFilterDivider && <StyledDivider orientation="vertical" flexItem />}

            <StyledFilterContainer>
              <Typography fontWeight="bold">{t('common.language')}</Typography>
              <LanguageFilter />
            </StyledFilterContainer>
          </Grid>

          <StyledDivider />

          <Grid item xs={12} sx={gridItemStyles}>
            <StyledFilterContainer>
              <Typography fontWeight="bold">{t('registration.contributors.contributor')}</Typography>
              <SearchForm paramName={ResultParam.ContributorName} placeholder={t('search.search_for_contributor')} />
            </StyledFilterContainer>

            {showFilterDivider && <StyledDivider orientation="vertical" flexItem />}
            <StyledFilterContainer>
              <Typography fontWeight="bold">{t('common.institution')}</Typography>
              <OrganizationFilters topLevelOrganizationId={topLevelOrganizationId} unitId={unitId} />
            </StyledFilterContainer>
          </Grid>

          <StyledDivider />

          <Grid item xs={12} sx={gridItemStyles}>
            <StyledFilterContainer>
              <Typography fontWeight="bold">{t('common.publisher')}</Typography>
              <PublisherFilter />
            </StyledFilterContainer>

            <StyledFilterContainer>
              <Typography fontWeight="bold">{t('registration.resource_type.journal')}</Typography>
              <JournalFilter />
            </StyledFilterContainer>

            <StyledFilterContainer>
              <Typography fontWeight="bold">{t('registration.resource_type.series')}</Typography>
              <SeriesFilter />
            </StyledFilterContainer>
          </Grid>

          <StyledDivider />

          <Grid item xs={12} sx={gridItemStyles}>
            <StyledFilterContainer>
              <Typography fontWeight="bold">{t('common.financier')}</Typography>
              <FundingSourceFilter />
            </StyledFilterContainer>

            <StyledFilterContainer>
              <Typography fontWeight="bold">{t('project.grant_id')}</Typography>
              <SearchForm
                paramName={ResultParam.FundingIdentifier}
                placeholder={t('search.search_for_funding_identifier')}
              />
            </StyledFilterContainer>
          </Grid>
        </Box>
      </Grid>

      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
        <Button variant="outlined" onClick={clearSearchParams} sx={{ mr: '0.5rem' }}>
          {t('search.advanced_search.clear_search')}
        </Button>
      </Grid>

      <Grid item md={12} sx={{ m: '0.5rem' }}>
        <RegistrationSearch registrationQuery={resultSearchQuery} />
      </Grid>
    </Grid>
  );
};
