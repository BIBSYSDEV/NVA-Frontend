import FilterIcon from '@mui/icons-material/FilterAltOutlined';
import InsightsIcon from '@mui/icons-material/Insights';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory } from 'react-router-dom';
import {
  PersonSearchParameter,
  PersonSearchParams,
  ProjectSearchParameter,
  ProjectsSearchParams,
  searchForPerson,
  searchForProjects,
} from '../../api/cristinApi';
import { FetchResultsParams, ResultParam, ResultSearchOrder, SortOrder, fetchResults } from '../../api/searchApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { NavigationList, SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { SelectableButton } from '../../components/SelectableButton';
import { SideMenu } from '../../components/SideMenu';
import { PublicationInstanceType } from '../../types/registration.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { SearchParam } from '../../utils/searchHelpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { ClinicalTreatmentStudiesReports } from '../reports/ClinicalTreatmentStudiesReports';
import { InternationalCooperationReports } from '../reports/InternationalCooperationReports';
import { NviReports } from '../reports/NviReports';
import ReportsPage from '../reports/ReportsPage';
import { SearchPage } from '../search/SearchPage';
import { AdvancedSearchPage } from '../search/advanced_search/AdvancedSearchPage';
import { PersonFacetsFilter } from '../search/person_search/PersonFacetsFilter';
import { ProjectFacetsFilter } from '../search/project_search/ProjectFacetsFilter';
import { RegistrationFacetsFilter } from '../search/registration_search/filters/RegistrationFacetsFilter';

enum SearchTypeValue {
  Result = 'result',
  Person = 'person',
  Project = 'project',
}

const HomePage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const paramsSearchType = params.get(SearchParam.Type);

  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash

  const isOnFilterPage = history.location.pathname === UrlPathTemplate.Home;
  const resultIsSelected = isOnFilterPage && (!paramsSearchType || paramsSearchType === SearchTypeValue.Result);
  const personIsSeleced = isOnFilterPage && paramsSearchType === SearchTypeValue.Person;
  const projectIsSelected = isOnFilterPage && paramsSearchType === SearchTypeValue.Project;

  const rowsPerPage = Number(params.get(SearchParam.Results) ?? ROWS_PER_PAGE_OPTIONS[0]);
  const page = Number(params.get(SearchParam.Page) ?? 1);

  const registrationSearchTerm = params.get(ResultParam.Query);
  const registrationsQueryConfig: FetchResultsParams = {
    abstract: params.get(ResultParam.Abstract),
    aggregation: 'all',
    category: params.get(ResultParam.Category) as PublicationInstanceType | null,
    contributor: params.get(ResultParam.Contributor),
    contributorName: params.get(ResultParam.ContributorName),
    course: params.get(ResultParam.Course),
    cristinIdentifier: params.get(ResultParam.CristinIdentifier),
    files: params.get(ResultParam.Files),
    doi: params.get(ResultParam.Doi),
    from: Number(params.get(ResultParam.From) ?? 0),
    fundingIdentifier: params.get(ResultParam.FundingIdentifier),
    fundingSource: params.get(ResultParam.FundingSource),
    handle: params.get(ResultParam.Handle),
    id: params.get(ResultParam.Identifier),
    isbn: params.get(ResultParam.Isbn),
    issn: params.get(ResultParam.Issn),
    journal: params.get(ResultParam.Journal),
    order: params.get(ResultParam.Order) as ResultSearchOrder | null,
    publicationYearSince: params.get(ResultParam.PublicationYearSince),
    publicationYearBefore: params.get(ResultParam.PublicationYearBefore),
    publisher: params.get(ResultParam.Publisher),
    query: registrationSearchTerm,
    results: rowsPerPage,
    scientificIndex: params.get(ResultParam.ScientificIndex),
    series: params.get(ResultParam.Series),
    sort: params.get(ResultParam.Sort) as SortOrder | null,
    tags: params.get(ResultParam.Tags),
    title: params.get(ResultParam.Title),
    topLevelOrganization: params.get(ResultParam.TopLevelOrganization),
  };

  const registrationQuery = useQuery({
    enabled: resultIsSelected,
    queryKey: ['registrations', registrationsQueryConfig],
    queryFn: ({ signal }) => fetchResults(registrationsQueryConfig, signal),
    meta: { errorMessage: t('feedback.error.search') },
    placeholderData: keepPreviousData,
  });

  const personSearchTerm = params.get(PersonSearchParameter.Name) ?? '.';
  const personQueryParams: PersonSearchParams = {
    name: personSearchTerm,
    orderBy: params.get(PersonSearchParameter.OrderBy),
    organization: params.get(PersonSearchParameter.Organization),
    sector: params.get(PersonSearchParameter.Sector),
    sort: params.get(PersonSearchParameter.Sort),
  };
  const personQuery = useQuery({
    enabled: personIsSeleced,
    queryKey: ['person', rowsPerPage, page, personQueryParams],
    queryFn: () => searchForPerson(rowsPerPage, page, personQueryParams),
    meta: { errorMessage: t('feedback.error.search') },
    placeholderData: keepPreviousData,
  });

  const projectSearchTerm = params.get(ProjectSearchParameter.Query);
  const projectQueryParams: ProjectsSearchParams = {
    coordinatingFacet: params.get(ProjectSearchParameter.CoordinatingFacet),
    categoryFacet: params.get(ProjectSearchParameter.CategoryFacet),
    fundingSourceFacet: params.get(ProjectSearchParameter.FundingSourceFacet),
    healthProjectFacet: params.get(ProjectSearchParameter.HealthProjectFacet),
    orderBy: params.get(ProjectSearchParameter.OrderBy),
    participantFacet: params.get(ProjectSearchParameter.ParticipantFacet),
    participantOrgFacet: params.get(ProjectSearchParameter.ParticipantOrgFacet),
    responsibleFacet: params.get(ProjectSearchParameter.ResponsibleFacet),
    sectorFacet: params.get(ProjectSearchParameter.SectorFacet),
    sort: params.get(ProjectSearchParameter.Sort),
    status: params.get(ProjectSearchParameter.Status),
    query: projectSearchTerm,
  };
  const projectQuery = useQuery({
    enabled: projectIsSelected,
    queryKey: ['projects', rowsPerPage, page, projectQueryParams],
    queryFn: () => searchForProjects(rowsPerPage, page, projectQueryParams),
    meta: { errorMessage: t('feedback.error.project_search') },
    placeholderData: keepPreviousData,
  });

  return (
    <StyledPageWithSideMenu>
      <SideMenu>
        <SideNavHeader icon={SearchIcon} text={t('common.search')} />
        <NavigationListAccordion
          title={t('search.advanced_search.advanced_search')}
          startIcon={<SearchIcon sx={{ bgcolor: 'white' }} />}
          accordionPath={UrlPathTemplate.Search}
          dataTestId={dataTestId.startPage.advancedSearchAccordion}>
          <Typography sx={{ m: '0.5rem 1rem 1rem 1rem' }}>
            {t('search.advanced_search.advanced_search_description')}
          </Typography>
        </NavigationListAccordion>

        <NavigationListAccordion
          title={t('common.filter')}
          startIcon={<FilterIcon sx={{ bgcolor: 'white' }} />}
          accordionPath=""
          expanded={currentPath === ''}
          dataTestId={dataTestId.startPage.filterAccordion}>
          <Box sx={{ m: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {resultIsSelected ? (
              <RegistrationFacetsFilter registrationQuery={registrationQuery} />
            ) : personIsSeleced ? (
              personQuery.data?.aggregations ? (
                <PersonFacetsFilter personQuery={personQuery} />
              ) : null
            ) : projectIsSelected ? (
              projectQuery.data?.aggregations ? (
                <ProjectFacetsFilter projectQuery={projectQuery} />
              ) : null
            ) : null}
          </Box>
        </NavigationListAccordion>

        <NavigationListAccordion
          title={t('search.reports.reports')}
          startIcon={<InsightsIcon sx={{ bgcolor: 'white' }} />}
          accordionPath={UrlPathTemplate.Reports}
          dataTestId={dataTestId.startPage.reportsAccordion}>
          <NavigationList>
            <SelectableButton
              data-testid={dataTestId.startPage.reportsOverviewButton}
              isSelected={currentPath === UrlPathTemplate.Reports}
              to={UrlPathTemplate.Reports}>
              {t('common.overview')}
            </SelectableButton>
            <SelectableButton
              data-testid={dataTestId.startPage.reportsNviButton}
              isSelected={currentPath === UrlPathTemplate.ReportsNvi}
              to={UrlPathTemplate.ReportsNvi}>
              {t('common.nvi')}
            </SelectableButton>
            <SelectableButton
              data-testid={dataTestId.startPage.reportsInternationalWorkButton}
              isSelected={currentPath === UrlPathTemplate.ReportsInternationalCooperation}
              to={UrlPathTemplate.ReportsInternationalCooperation}>
              {t('search.reports.international_cooperation')}
            </SelectableButton>
            <SelectableButton
              data-testid={dataTestId.startPage.reportsClinicalTreatmentStudiesButton}
              isSelected={currentPath === UrlPathTemplate.ReportsClinicalTreatmentStudies}
              to={UrlPathTemplate.ReportsClinicalTreatmentStudies}>
              {t('search.reports.clinical_treatment_studies')}
            </SelectableButton>
          </NavigationList>
        </NavigationListAccordion>
      </SideMenu>

      <Switch>
        <ErrorBoundary>
          <Route exact path={UrlPathTemplate.Home}>
            <SearchPage registrationQuery={registrationQuery} personQuery={personQuery} projectQuery={projectQuery} />
          </Route>
          <Route exact path={UrlPathTemplate.Search} component={AdvancedSearchPage} />
          <Route exact path={UrlPathTemplate.Reports} component={ReportsPage} />
          <Route exact path={UrlPathTemplate.ReportsNvi} component={NviReports} />
          <Route
            exact
            path={UrlPathTemplate.ReportsInternationalCooperation}
            component={InternationalCooperationReports}
          />
          <Route
            exact
            path={UrlPathTemplate.ReportsClinicalTreatmentStudies}
            component={ClinicalTreatmentStudiesReports}
          />
        </ErrorBoundary>
      </Switch>
    </StyledPageWithSideMenu>
  );
};

export default HomePage;
