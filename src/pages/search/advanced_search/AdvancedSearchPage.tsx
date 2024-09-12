import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/system';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { FetchResultsParams, ResultParam, ResultSearchOrder, SortOrder, fetchResults } from '../../../api/searchApi';
import { CategorySearchFilter } from '../../../components/CategorySearchFilter';
import { SearchForm } from '../../../components/SearchForm';
import { ScientificIndexStatuses } from '../../../types/nvi.types';
import { PublicationInstanceType } from '../../../types/registration.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { ExportResultsButton } from '../ExportResultsButton';
import { PublicationYearIntervalFilter } from '../PublicationYearIntervalFilter';
import { RegistrationSearch } from '../registration_search/RegistrationSearch';
import { FileStatusSelect } from './FileStatusSelect';
import { FundingSourceFilter } from './FundingSourceFilter';
import { JournalFilter } from './JournalFilter';
import { LanguageFilter } from './LanguageFilter';
import { OrganizationFilters } from './OrganizationFilters';
import { PublisherFilter } from './PublisherFilter';
import { ScientificValueFilter } from './ScientificValueFilter';
import { SeriesFilter } from './SeriesFilter';
import { VocabularSearchField } from './VocabularSearchField';

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

export const StyledFilterTitle = styled(Typography)({
  marginBottom: '0.2rem',
  fontWeight: 'bold',
});

const gridRowDivider = (
  <Grid item xs={12}>
    <StyledDivider />
  </Grid>
);

export const AdvancedSearchPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

  const params = new URLSearchParams(history.location.search);

  const categoryShould = (params.get(ResultParam.CategoryShould)?.split(',') as PublicationInstanceType[] | null) ?? [];
  const topLevelOrganizationId = params.get(ResultParam.TopLevelOrganization);
  const unitId = params.get(ResultParam.Unit);
  const excludeSubunits = params.get(ResultParam.ExcludeSubunits) === 'true';

  const resultSearchQueryConfig: FetchResultsParams = {
    categoryShould,
    contributorName: params.get(ResultParam.ContributorName),
    course: params.get(ResultParam.Course),
    files: params.get(ResultParam.Files),
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
    vocabulary: params.get(ResultParam.Vocabulary),
  };

  const resultSearchQuery = useQuery({
    queryKey: ['registrations', resultSearchQueryConfig],
    queryFn: () => fetchResults(resultSearchQueryConfig),
    meta: { errorMessage: t('feedback.error.search') },
    placeholderData: keepPreviousData,
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
    <Grid container rowGap={2}>
      <Grid container rowGap={2} sx={{ px: { xs: '0.5rem', md: 0 } }}>
        <Typography variant="h2">{t('search.advanced_search.advanced_search')}</Typography>
        <Grid item xs={12}>
          <StyledFilterTitle>{t('search.advanced_search.title_search')}</StyledFilterTitle>
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
            <StyledFilterTitle>{t('search.advanced_search.publishing_period')}</StyledFilterTitle>
            <PublicationYearIntervalFilter />
          </Grid>

          {isLargeScreen && <StyledDivider orientation="vertical" flexItem />}

          <Grid item>
            <CategorySearchFilter searchParam={ResultParam.CategoryShould} />
          </Grid>

          {isLargeScreen && <StyledDivider orientation="vertical" flexItem />}

          <Grid item>
            <StyledFilterTitle id="language-select-label">{t('common.language')}</StyledFilterTitle>
            <LanguageFilter />
          </Grid>

          {isLargeScreen && <StyledDivider orientation="vertical" flexItem />}

          <Grid item>
            <StyledFilterTitle>{t('common.nvi')}</StyledFilterTitle>
            <FormControlLabel
              data-testid={dataTestId.startPage.advancedSearch.scientificIndexStatusCheckbox}
              control={<Checkbox name="scientificIndexStatus" />}
              onChange={handleNviReportedCheckbox}
              checked={params.get(ResultParam.ScientificIndexStatus) === ScientificIndexStatuses.Reported}
              label={t('search.advanced_search.reported')}
            />
          </Grid>

          {isLargeScreen && <StyledDivider orientation="vertical" flexItem />}

          <Grid item>
            <StyledFilterTitle id="file-status-select-label">
              {t('registration.files_and_license.files')}
            </StyledFilterTitle>
            <FileStatusSelect />
          </Grid>
        </Grid>

        {gridRowDivider}

        <Grid container item direction={isLargeScreen ? 'row' : 'column'} xs={12} gap={2}>
          <Grid item>
            <StyledFilterTitle>{t('registration.contributors.contributor')}</StyledFilterTitle>
            <SearchForm paramName={ResultParam.ContributorName} placeholder={t('search.search_for_contributor')} />
          </Grid>

          {isLargeScreen && <StyledDivider orientation="vertical" flexItem />}

          <Grid item>
            <OrganizationFilters topLevelOrganizationId={topLevelOrganizationId} unitId={unitId} />
          </Grid>
        </Grid>

        {gridRowDivider}

        <Grid container item direction={isLargeScreen ? 'row' : 'column'} xs={12} gap={2}>
          <Grid container item direction={isLargeScreen ? 'row' : 'column'} gap={2}>
            <Grid item>
              <PublisherFilter />
            </Grid>

            <Grid item>
              <JournalFilter />
            </Grid>

            <Grid item>
              <SeriesFilter />
            </Grid>
          </Grid>

          <Grid item>
            <ScientificValueFilter />
          </Grid>
        </Grid>

        {gridRowDivider}

        <Grid container item direction={isLargeScreen ? 'row' : 'column'} xs={12} gap={2}>
          <Grid item>
            <StyledFilterTitle>{t('common.financier')}</StyledFilterTitle>
            <FundingSourceFilter />
          </Grid>

          <Grid item>
            <StyledFilterTitle>{t('project.grant_id')}</StyledFilterTitle>
            <SearchForm
              paramName={ResultParam.FundingIdentifier}
              placeholder={t('search.search_for_funding_identifier')}
            />
          </Grid>

          {isLargeScreen && <StyledDivider orientation="vertical" flexItem />}

          <Grid item>
            <StyledFilterTitle>{t('registration.resource_type.course_code')}</StyledFilterTitle>
            <SearchForm
              dataTestId={dataTestId.startPage.advancedSearch.courseField}
              paramName={ResultParam.Course}
              placeholder={t('search.search_for_course_code')}
            />
          </Grid>

          {isLargeScreen && <StyledDivider orientation="vertical" flexItem />}

          <Grid item>
            <StyledFilterTitle>{t('editor.vocabulary')}</StyledFilterTitle>
            <VocabularSearchField />
          </Grid>
        </Grid>

        <Grid container item xs={12} sx={{ justifyContent: isLargeScreen ? 'end' : 'center' }}>
          <Button variant="outlined" onClick={() => history.push(history.location.pathname)}>
            {t('search.reset_selection')}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <RegistrationSearch registrationQuery={resultSearchQuery} />
      </Grid>
    </Grid>
  );
};
