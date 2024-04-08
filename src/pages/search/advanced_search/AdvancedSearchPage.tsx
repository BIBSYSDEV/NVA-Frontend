import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { fetchResults, FetchResultsParams, ResultParam, ResultSearchOrder, SortOrder } from '../../../api/searchApi';
import { CategoryChip } from '../../../components/CategorySelector';
import { SearchForm } from '../../../components/SearchForm';
import { ScientificIndexStatuses } from '../../../types/nvi.types';
import { PublicationInstanceType } from '../../../types/registration.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { ExportResultsButton } from '../ExportResultsButton';
import { PublicationDateIntervalFilter } from '../PublicationDateIntervalFilter';
import { RegistrationSearch } from '../registration_search/RegistrationSearch';
import { CategoryFilterDialog } from './CategoryFilterDialog';
import { FundingSourceFilter } from './FundingSourceFilter';
import { JournalFilter } from './JournalFilter';
import { LanguageFilter } from './LanguageFilter';
import { OrganizationFilters } from './OrganizationFilters';
import { PublisherFilter } from './PublisherFilter';
import { ScientificValueFilter } from './ScientificValueFilter';
import { SeriesFilter } from './SeriesFilter';

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const StyledTypography = styled(Typography)({
  marginBottom: '0.5rem',
});

const GridRowDivider = () => {
  return (
    <Grid item xs={12}>
      <StyledDivider />
    </Grid>
  );
};

export const AdvancedSearchPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const showFilterDivider = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const [openCategoryFilter, setOpenCategoryFilter] = useState(false);
  const toggleCategoryFilter = () => setOpenCategoryFilter(!openCategoryFilter);

  const params = new URLSearchParams(history.location.search);

  const categoryShould = (params.get(ResultParam.CategoryShould)?.split(',') as PublicationInstanceType[] | null) ?? [];
  const topLevelOrganizationId = params.get(ResultParam.TopLevelOrganization);
  const unitId = params.get(ResultParam.Unit);
  const excludeSubunits = params.get(ResultParam.ExcludeSubunits) === 'true';

  const resultSearchQueryConfig: FetchResultsParams = {
    categoryShould,
    contributorName: params.get(ResultParam.ContributorName),
    from: Number(params.get(ResultParam.From) ?? 0),
    fundingIdentifier: params.get(ResultParam.FundingIdentifier),
    fundingSource: params.get(ResultParam.FundingSource),
    journal: params.get(ResultParam.Journal),
    order: params.get(ResultParam.Order) as ResultSearchOrder | null,
    publicationLanguageShould: params.get(ResultParam.PublicationLanguageShould),
    publicationYearBefore: params.get(ResultParam.PublicationYearBefore),
    publicationYearSince: params.get(ResultParam.PublicationYearSince),
    publisher: params.get(ResultParam.Publisher),
    results: Number(params.get(ResultParam.Results) ?? ROWS_PER_PAGE_OPTIONS[0]),
    scientificIndexStatus: params.get(ResultParam.ScientificIndexStatus) as ScientificIndexStatuses | null,
    scientificValue: params.get(ResultParam.ScientificValue),
    series: params.get(ResultParam.Series),
    sort: params.get(ResultParam.Sort) as SortOrder | null,
    title: params.get(ResultParam.Title),
    excludeSubunits,
    unit: unitId ?? topLevelOrganizationId,
  };

  const resultSearchQuery = useQuery({
    queryKey: ['registrations', resultSearchQueryConfig],
    queryFn: () => fetchResults(resultSearchQueryConfig),
    meta: { errorMessage: t('feedback.error.search') },
    keepPreviousData: true,
  });

  const handleNviReportedCheckbox = (event: React.SyntheticEvent, checked: boolean) => {
    if (checked) {
      params.set(ResultParam.ScientificIndexStatus, ScientificIndexStatuses.Reported);
    } else {
      params.delete(ResultParam.ScientificIndexStatus);
    }

    history.push({ search: params.toString() });
  };

  return (
    <Grid
      container
      rowGap={2}
      sx={{
        bgcolor: 'secondary.main',
        p: '1rem',
      }}>
      <Typography variant="h3">{t('search.advanced_search.advanced_search')}</Typography>
      <Grid item xs={12}>
        <StyledTypography fontWeight="bold">{t('search.advanced_search.title_search')}</StyledTypography>
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <SearchForm
            sx={{ flex: '1 0 15rem' }}
            paramName={ResultParam.Title}
            placeholder={t('search.search_for_title')}
          />
          <ExportResultsButton searchParams={params} />
        </Box>
        <StyledDivider sx={{ mt: '1rem' }} />
      </Grid>

      <Grid item container direction={isLargeScreen ? 'row' : 'column'} xs={12} gap={2}>
        <Grid item sx={{ width: 'fit-content' }}>
          <StyledTypography fontWeight="bold">{t('search.advanced_search.publishing_period')}</StyledTypography>
          <PublicationDateIntervalFilter />
        </Grid>

        {showFilterDivider && <StyledDivider orientation="vertical" flexItem />}

        <Grid item>
          <StyledTypography fontWeight="bold">{t('common.category')}</StyledTypography>
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
        </Grid>

        {showFilterDivider && <StyledDivider orientation="vertical" flexItem />}

        <Grid item>
          <StyledTypography fontWeight="bold">{t('common.language')}</StyledTypography>
          <LanguageFilter />
        </Grid>

        {showFilterDivider && <StyledDivider orientation="vertical" flexItem />}

        <Grid item>
          <StyledTypography fontWeight="bold">{t('common.nvi')}</StyledTypography>
          <FormControlLabel
            data-testid={dataTestId.startPage.advancedSearch.scientificIndexStatusCheckbox}
            control={<Checkbox name="scientificIndexStatus" />}
            onChange={handleNviReportedCheckbox}
            checked={params.get(ResultParam.ScientificIndexStatus) === ScientificIndexStatuses.Reported}
            label={t('search.advanced_search.reported')}
          />
        </Grid>
      </Grid>

      <GridRowDivider />

      <Grid container item direction={isLargeScreen ? 'row' : 'column'} xs={12} gap={2}>
        <Grid item>
          <StyledTypography fontWeight="bold">{t('registration.contributors.contributor')}</StyledTypography>
          <SearchForm paramName={ResultParam.ContributorName} placeholder={t('search.search_for_contributor')} />
        </Grid>

        {showFilterDivider && <StyledDivider orientation="vertical" flexItem />}

        <Grid item>
          <StyledTypography fontWeight="bold">{t('common.institution')}</StyledTypography>
          <OrganizationFilters topLevelOrganizationId={topLevelOrganizationId} unitId={unitId} />
        </Grid>
      </Grid>

      <GridRowDivider />

      <Grid container item direction={isLargeScreen ? 'row' : 'column'} xs={12} gap={2}>
        <Grid container item direction={isLargeScreen ? 'row' : 'column'} gap={2}>
          <Grid item>
            <StyledTypography fontWeight="bold">{t('common.publisher')}</StyledTypography>
            <PublisherFilter />
          </Grid>

          <Grid item>
            <StyledTypography fontWeight="bold">{t('registration.resource_type.journal')}</StyledTypography>
            <JournalFilter />
          </Grid>

          <Grid item>
            <StyledTypography fontWeight="bold">{t('registration.resource_type.series')}</StyledTypography>
            <SeriesFilter />
          </Grid>
        </Grid>

        <Grid item>
          <ScientificValueFilter />
        </Grid>
      </Grid>

      <GridRowDivider />

      <Grid container item direction={isLargeScreen ? 'row' : 'column'} xs={12} gap={2}>
        <Grid item>
          <StyledTypography fontWeight="bold">{t('common.financier')}</StyledTypography>
          <FundingSourceFilter />
        </Grid>

        <Grid item>
          <StyledTypography fontWeight="bold">{t('project.grant_id')}</StyledTypography>
          <SearchForm
            paramName={ResultParam.FundingIdentifier}
            placeholder={t('search.search_for_funding_identifier')}
          />
        </Grid>
      </Grid>
      <Grid container item xs={12} sx={{ justifyContent: isLargeScreen ? 'end' : 'center' }}>
        <Button variant="outlined" onClick={() => history.push(history.location.pathname)}>
          {t('search.reset_selection')}
        </Button>
      </Grid>
      <Grid item xs={12} sx={{ m: '0.5rem' }}>
        <RegistrationSearch registrationQuery={resultSearchQuery} />
      </Grid>
    </Grid>
  );
};
