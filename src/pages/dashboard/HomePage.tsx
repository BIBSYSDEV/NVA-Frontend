import FilterIcon from '@mui/icons-material/FilterAltOutlined';
import InsightsIcon from '@mui/icons-material/Insights';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import {
  PersonSearchParameter,
  PersonSearchParams,
  ProjectSearchParameter,
  ProjectsSearchParams,
  searchForPerson,
  searchForProjects,
} from '../../api/cristinApi';
import { FetchResultsParams, ResultParam, SortOrder, fetchResults } from '../../api/searchApi';
import { BetaFunctionality } from '../../components/BetaFunctionality';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { LinkButton, NavigationList, SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
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
import { AdvancedSearchPage } from '../search/advanced_search/AdvancesSearchPage';
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
  const location = useLocation();
  const params = new URLSearchParams(history.location.search);
  const paramsSearchType = params.get(SearchParam.Type);

  const currentPath = location.pathname.replace(/\/$/, ''); // Remove trailing slash

  const resultIsSelected = !paramsSearchType || paramsSearchType === SearchTypeValue.Result;
  const personIsSeleced = paramsSearchType === SearchTypeValue.Person;
  const projectIsSelected = paramsSearchType === SearchTypeValue.Project;

  const rowsPerPage = Number(params.get(SearchParam.Results) ?? ROWS_PER_PAGE_OPTIONS[0]);
  const page = Number(params.get(SearchParam.Page) ?? 1);

  const registrationSearchTerm = params.get(ResultParam.Query);
  const registrationsQueryConfig: FetchResultsParams = {
    query: registrationSearchTerm,
    abstract: params.get(ResultParam.Abstract),
    category: params.get(ResultParam.Category) as PublicationInstanceType | null,
    topLevelOrganization: params.get(ResultParam.TopLevelOrganization),
    fundingSource: params.get(ResultParam.FundingSource),
    contributor: params.get(ResultParam.Contributor),
    contributorName: params.get(ResultParam.ContributorName),
    tags: params.get(ResultParam.Tags),
    title: params.get(ResultParam.Title),
    sort: params.get(ResultParam.Sort) as SortOrder | null,
    order: params.get(ResultParam.Order),
    from: Number(params.get(SearchParam.From) ?? 0),
    results: rowsPerPage,
  };
  const registrationQuery = useQuery({
    queryKey: ['registrations', registrationsQueryConfig],
    queryFn: () => fetchResults(registrationsQueryConfig),
    meta: { errorMessage: t('feedback.error.search') },
    keepPreviousData: true,
  });

  const personSearchTerm = params.get(PersonSearchParameter.Name) ?? '.';
  const personQueryParams: PersonSearchParams = {
    name: personSearchTerm,
    organization: params.get(PersonSearchParameter.Organization),
    sector: params.get(PersonSearchParameter.Sector),
  };
  const personQuery = useQuery({
    enabled: personIsSeleced,
    queryKey: ['person', rowsPerPage, page, personQueryParams],
    queryFn: () => searchForPerson(rowsPerPage, page, personQueryParams),
    meta: { errorMessage: t('feedback.error.search') },
    keepPreviousData: true,
  });

  const projectSearchTerm = params.get(ProjectSearchParameter.Title);
  const projectQueryParams: ProjectsSearchParams = {
    coordinatingFacet: params.get(ProjectSearchParameter.CoordinatingFacet),
    categoryFacet: params.get(ProjectSearchParameter.CategoryFacet),
    fundingSourceFacet: params.get(ProjectSearchParameter.FundingSourceFacet),
    healthProjectFacet: params.get(ProjectSearchParameter.HealthProjectFacet),
    participantFacet: params.get(ProjectSearchParameter.ParticipantFacet),
    participantOrgFacet: params.get(ProjectSearchParameter.ParticipantOrgFacet),
    responsibleFacet: params.get(ProjectSearchParameter.ResponsibleFacet),
    sectorFacet: params.get(ProjectSearchParameter.SectorFacet),
    title: projectSearchTerm,
  };
  const projectQuery = useQuery({
    enabled: projectIsSelected,
    queryKey: ['projects', rowsPerPage, page, projectQueryParams],
    queryFn: () => searchForProjects(rowsPerPage, page, projectQueryParams),
    meta: { errorMessage: t('feedback.error.project_search') },
    keepPreviousData: true,
  });

  return (
    <StyledPageWithSideMenu>
      <SideMenu>
        <SideNavHeader icon={SearchIcon} text={t('common.search')} />
        <NavigationListAccordion
          title={t('common.filter')}
          startIcon={<FilterIcon sx={{ bgcolor: 'white' }} />}
          accordionPath=""
          expanded={currentPath === ''}
          dataTestId={dataTestId.startPage.filterAccordion}>
          <Box sx={{ m: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {resultIsSelected ? (
              registrationQuery.data?.aggregations ? (
                <RegistrationFacetsFilter registrationQuery={registrationQuery} />
              ) : null
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

        <BetaFunctionality>
          <NavigationListAccordion
            title={t('search.advanced_search')}
            startIcon={<SearchIcon sx={{ bgcolor: 'white' }} />}
            accordionPath={UrlPathTemplate.Search}
            dataTestId={dataTestId.startPage.advancedSearchAccordion}>
            <Typography sx={{ m: '0.5rem 1rem 1rem 1rem' }}>{t('search.advanced_search_description')}</Typography>
          </NavigationListAccordion>
        </BetaFunctionality>

        <NavigationListAccordion
          title={t('search.reports.reports')}
          startIcon={<InsightsIcon sx={{ bgcolor: 'white' }} />}
          accordionPath={UrlPathTemplate.Reports}
          dataTestId={dataTestId.startPage.reportsAccordion}>
          <NavigationList>
            <LinkButton
              data-testid={dataTestId.startPage.reportsOverviewButton}
              isSelected={currentPath === UrlPathTemplate.Reports}
              to={UrlPathTemplate.Reports}>
              {t('common.overview')}
            </LinkButton>
            <LinkButton
              data-testid={dataTestId.startPage.reportsNviButton}
              isSelected={currentPath === UrlPathTemplate.ReportsNvi}
              to={UrlPathTemplate.ReportsNvi}>
              {t('common.nvi')}
            </LinkButton>
            <LinkButton
              data-testid={dataTestId.startPage.reportsInternationalWorkButton}
              isSelected={currentPath === UrlPathTemplate.ReportsInternationalCooperation}
              to={UrlPathTemplate.ReportsInternationalCooperation}>
              {t('search.reports.international_cooperation')}
            </LinkButton>
            <LinkButton
              data-testid={dataTestId.startPage.reportsClinicalTreatmentStudiesButton}
              isSelected={currentPath === UrlPathTemplate.ReportsClinicalTreatmentStudies}
              to={UrlPathTemplate.ReportsClinicalTreatmentStudies}>
              {t('search.reports.clinical_treatment_studies')}
            </LinkButton>
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
