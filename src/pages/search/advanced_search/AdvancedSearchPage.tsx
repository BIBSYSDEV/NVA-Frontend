import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  styled,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useRegistrationSearch } from '../../../api/hooks/useRegistrationSearch';
import { ResultParam } from '../../../api/searchApi';
import { CategorySearchFilter } from '../../../components/CategorySearchFilter';
import { HeadTitle } from '../../../components/HeadTitle';
import { SearchForm } from '../../../components/SearchForm';
import { StyledFilterHeading } from '../../../components/styled/Wrappers';
import { ScientificIndexStatuses } from '../../../types/nvi.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useRegistrationsQueryParams } from '../../../utils/hooks/useRegistrationSearchParams';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { ExportResultsButton } from '../ExportResultsButton';
import { PublicationYearIntervalFilter } from '../PublicationYearIntervalFilter';
import { RegistrationSearch } from '../registration_search/RegistrationSearch';
import { FileStatusSelect } from './FileStatusSelect';
import { FundingSourceFilter } from './FundingSourceFilter';
import { JournalFilter } from './JournalFilter';
import { LanguageFilter } from './LanguageFilter';
import { NviReportedYearFilter } from './NviReportedYearFilter';
import { OrganizationFilters } from './OrganizationFilters';
import { PublisherFilter } from './PublisherFilter';
import { ScientificValueFilter } from './ScientificValueFilter';
import { SeriesFilter } from './SeriesFilter';
import { VocabularSearchField } from './VocabularSearchField';

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const gridRowDivider = (
  <Grid size={12}>
    <StyledDivider />
  </Grid>
);

const AdvancedSearchPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

  const params = new URLSearchParams(location.search);

  const registrationParams = useRegistrationsQueryParams();
  const resultSearchQuery = useRegistrationSearch({
    params: { ...registrationParams, unit: registrationParams.unit ?? registrationParams.topLevelOrganization },
    keepDataWhileLoading: true,
  });

  const handleNviReportedCheckbox = (_: unknown, checked: boolean) => {
    const syncedParams = syncParamsWithSearchFields(params);
    if (checked) {
      syncedParams.set(ResultParam.ScientificIndexStatus, ScientificIndexStatuses.Reported);
    } else {
      syncedParams.delete(ResultParam.ScientificIndexStatus);
      syncedParams.delete(ResultParam.ScientificReportPeriodBeforeParam);
      syncedParams.delete(ResultParam.ScientificReportPeriodSinceParam);
    }

    syncedParams.delete(ResultParam.From);
    navigate({ search: syncedParams.toString() });
  };

  return (
    <>
      <HeadTitle>{t('search.advanced_search.advanced_search')}</HeadTitle>
      <Grid container rowGap={2}>
        <Grid container rowGap={2} sx={{ px: { xs: '0.5rem', md: 0 } }}>
          <Typography variant="h1">{t('search.advanced_search.advanced_search')}</Typography>
          <Grid size={12}>
            <StyledFilterHeading>{t('search.advanced_search.title_search')}</StyledFilterHeading>
            <Box sx={{ display: 'flex', gap: '0.5rem' }}>
              <SearchForm
                sx={{ flex: '1 0 15rem' }}
                paramName={ResultParam.Title}
                placeholder={t('search.search_for_title')}
                paginationOffsetParamName={ResultParam.From}
              />
              <ExportResultsButton searchParams={params} />
            </Box>
            <StyledDivider sx={{ mt: '1rem' }} />
          </Grid>

          <Grid container direction={isLargeScreen ? 'row' : 'column'} gap={2} size={12}>
            <Grid component="fieldset" sx={{ width: 'fit-content' }}>
              <StyledFilterHeading component="legend">
                {t('search.advanced_search.publishing_period')}
              </StyledFilterHeading>
              <PublicationYearIntervalFilter />
            </Grid>

            {isLargeScreen && <StyledDivider orientation="vertical" flexItem />}

            <Grid>
              <CategorySearchFilter searchParam={ResultParam.CategoryShould} />
            </Grid>

            {isLargeScreen && <StyledDivider orientation="vertical" flexItem />}

            <Grid>
              <StyledFilterHeading id="language-select-label">{t('common.language')}</StyledFilterHeading>
              <LanguageFilter />
            </Grid>

            {isLargeScreen && <StyledDivider orientation="vertical" flexItem />}

            <Grid>
              <StyledFilterHeading>{t('common.nvi')}</StyledFilterHeading>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  data-testid={dataTestId.startPage.advancedSearch.scientificIndexStatusCheckbox}
                  control={<Checkbox name="scientificIndexStatus" />}
                  onChange={handleNviReportedCheckbox}
                  checked={registrationParams.scientificIndexStatus === ScientificIndexStatuses.Reported}
                  label={t('search.advanced_search.reported')}
                />
                <NviReportedYearFilter />
              </Box>
            </Grid>

            {isLargeScreen && <StyledDivider orientation="vertical" flexItem />}

            <Grid>
              <StyledFilterHeading id="file-status-select-label">
                {t('registration.files_and_license.files')}
              </StyledFilterHeading>
              <FileStatusSelect />
            </Grid>
          </Grid>

          {gridRowDivider}

          <Grid container direction={isLargeScreen ? 'row' : 'column'} gap={2} size={12}>
            <Grid>
              <StyledFilterHeading>{t('registration.contributors.contributor')}</StyledFilterHeading>
              <SearchForm
                paramName={ResultParam.ContributorName}
                placeholder={t('search.person_search_placeholder')}
                paginationOffsetParamName={ResultParam.From}
              />
            </Grid>

            {isLargeScreen && <StyledDivider orientation="vertical" flexItem />}

            <Grid>
              <OrganizationFilters
                topLevelOrganizationId={registrationParams.topLevelOrganization ?? null}
                unitId={registrationParams.unit ?? null}
              />
            </Grid>
          </Grid>

          {gridRowDivider}

          <Grid container direction={isLargeScreen ? 'row' : 'column'} gap={2} size={12}>
            <Grid container direction={isLargeScreen ? 'row' : 'column'} gap={2}>
              <Grid>
                <PublisherFilter />
              </Grid>

              <Grid>
                <JournalFilter />
              </Grid>

              <Grid>
                <SeriesFilter />
              </Grid>
            </Grid>

            <Grid>
              <ScientificValueFilter />
            </Grid>
          </Grid>

          {gridRowDivider}

          <Grid container direction={isLargeScreen ? 'row' : 'column'} gap={2} size={12}>
            <Grid>
              <StyledFilterHeading>{t('common.financier')}</StyledFilterHeading>
              <FundingSourceFilter />
            </Grid>

            <Grid>
              <StyledFilterHeading>{t('project.grant_id')}</StyledFilterHeading>
              <SearchForm
                paramName={ResultParam.FundingIdentifier}
                placeholder={t('search.search_for_funding_identifier')}
                paginationOffsetParamName={ResultParam.From}
              />
            </Grid>

            {isLargeScreen && <StyledDivider orientation="vertical" flexItem />}

            <Grid>
              <StyledFilterHeading>{t('registration.resource_type.course_code')}</StyledFilterHeading>
              <SearchForm
                dataTestId={dataTestId.startPage.advancedSearch.courseField}
                paramName={ResultParam.Course}
                placeholder={t('search.search_for_course_code')}
                paginationOffsetParamName={ResultParam.From}
              />
            </Grid>

            {isLargeScreen && <StyledDivider orientation="vertical" flexItem />}

            <Grid>
              <StyledFilterHeading>{t('editor.vocabulary')}</StyledFilterHeading>
              <VocabularSearchField />
            </Grid>
          </Grid>

          <Grid container sx={{ justifyContent: isLargeScreen ? 'end' : 'center' }} size={12}>
            <Button variant="outlined" onClick={() => navigate(location.pathname)}>
              {t('search.reset_selection')}
            </Button>
          </Grid>
        </Grid>
        <Grid size={12}>
          <RegistrationSearch registrationQuery={resultSearchQuery} />
        </Grid>
      </Grid>
    </>
  );
};

export default AdvancedSearchPage;
