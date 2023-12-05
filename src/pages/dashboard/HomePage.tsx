import FilterIcon from '@mui/icons-material/FilterAltOutlined';
import InsightsIcon from '@mui/icons-material/Insights';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers } from 'formik';
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
import { FetchResultsParams, fetchResults } from '../../api/searchApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { LinkButton, NavigationList, SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { SideMenu } from '../../components/SideMenu';
import { PublicationInstanceType } from '../../types/registration.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import {
  SearchConfig,
  SearchParam,
  createRegistrationSearchQuery,
  createSearchConfigFromSearchParams,
} from '../../utils/searchHelpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { ClinicalTreatmentStudiesReports } from '../reports/ClinicalTreatmentStudiesReports';
import { InternationalCooperationReports } from '../reports/InternationalCooperationReports';
import { NviReports } from '../reports/NviReports';
import ReportsPage from '../reports/ReportsPage';
import { SearchPage } from '../search/SearchPage';
import { PersonFacetsFilter } from '../search/person_search/PersonFacetsFilter';
import { ProjectFacetsFilter } from '../search/project_search/ProjectFacetsFilter';
import { RegistrationFacetsFilter } from '../search/registration_search/filters/RegistrationFacetsFilter';

enum SearchTypeValue {
  Result = 'result',
  Person = 'person',
  Project = 'project',
}

const defaultResultSize = ROWS_PER_PAGE_OPTIONS[0].toString();

const HomePage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(history.location.search);
  const paramsSearchType = params.get(SearchParam.Type);

  const currentPath = location.pathname.replace(/\/$/, ''); // Remove trailing slash
  const isOnSearchPage = currentPath === '';

  const resultIsSelected = !paramsSearchType || paramsSearchType === SearchTypeValue.Result;
  const personIsSeleced = paramsSearchType === SearchTypeValue.Person;
  const projectIsSelected = paramsSearchType === SearchTypeValue.Project;

  const requestParams = new URLSearchParams(history.location.search);
  requestParams.delete(SearchParam.Type);

  const rowsPerPage = Number(requestParams.get(SearchParam.Results) ?? 10);
  const page = Number(requestParams.get(SearchParam.Page) ?? 1);

  const registrationsQueryConfig: FetchResultsParams = {
    query: requestParams.get(SearchParam.Query),
    category: requestParams.get('instanceType') as PublicationInstanceType | null,
  };
  const registrationOffset = (page - 1) * rowsPerPage;
  const registrationQuery = useQuery({
    queryKey: ['registrations', rowsPerPage, registrationOffset, registrationsQueryConfig],
    queryFn: () => fetchResults(rowsPerPage, registrationOffset, registrationsQueryConfig),
    meta: { errorMessage: t('feedback.error.search') },
    keepPreviousData: true,
  });

  const personQueryParams: PersonSearchParams = {
    name: requestParams.get(PersonSearchParameter.Name) ?? '.',
    organization: requestParams.get(PersonSearchParameter.Organization),
    sector: requestParams.get(PersonSearchParameter.Sector),
  };
  const personQuery = useQuery({
    enabled: personIsSeleced,
    queryKey: ['person', rowsPerPage, page, personQueryParams],
    queryFn: () => searchForPerson(rowsPerPage, page, personQueryParams),
    meta: { errorMessage: t('feedback.error.search') },
    keepPreviousData: true,
  });

  const projectQueryParams: ProjectsSearchParams = {
    coordinatingFacet: requestParams.get(ProjectSearchParameter.CoordinatingFacet),
    categoryFacet: requestParams.get(ProjectSearchParameter.CategoryFacet),
    fundingSourceFacet: requestParams.get(ProjectSearchParameter.FundingSourceFacet),
    healthProjectFacet: requestParams.get(ProjectSearchParameter.HealthProjectFacet),
    participantFacet: requestParams.get(ProjectSearchParameter.ParticipantFacet),
    participantOrgFacet: requestParams.get(ProjectSearchParameter.ParticipantOrgFacet),
    responsibleFacet: requestParams.get(ProjectSearchParameter.ResponsibleFacet),
    sectorFacet: requestParams.get(ProjectSearchParameter.SectorFacet),
    query: requestParams.get(SearchParam.Query),
  };

  const projectQuery = useQuery({
    enabled: projectIsSelected,
    queryKey: ['projects', rowsPerPage, page, projectQueryParams],
    queryFn: () => searchForProjects(rowsPerPage, page, projectQueryParams),
    meta: { errorMessage: t('feedback.error.project_search') },
    keepPreviousData: true,
  });

  const emptySearchParams: SearchConfig = {
    searchTerm: '',
    properties: [],
  };

  const initialSearchParams = createSearchConfigFromSearchParams(params);

  return (
    <Formik
      initialValues={initialSearchParams}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={(values) => {
        const previousParamsResults = params.get(SearchParam.Results);
        const newSearchParams = new URLSearchParams();
        if (resultIsSelected) {
          const queryString = createRegistrationSearchQuery(values);
          if (queryString) {
            newSearchParams.set(SearchParam.Query, queryString);
          }
          newSearchParams.set(SearchParam.Results, previousParamsResults ?? defaultResultSize);
          newSearchParams.set(SearchParam.From, '0');
        } else if (personIsSeleced) {
          newSearchParams.set(SearchParam.Type, SearchTypeValue.Person);
          if (values.searchTerm) {
            newSearchParams.set(SearchParam.Name, values.searchTerm);
            newSearchParams.set(SearchParam.Results, previousParamsResults ?? defaultResultSize);
            newSearchParams.set(SearchParam.Page, '1');
          }
        } else if (projectIsSelected) {
          newSearchParams.set(SearchParam.Type, SearchTypeValue.Project);
          if (values.searchTerm) {
            newSearchParams.set(SearchParam.Query, values.searchTerm);
            newSearchParams.set(SearchParam.Results, previousParamsResults ?? defaultResultSize);
            newSearchParams.set(SearchParam.Page, '1');
          }
        }
        history.push({ search: newSearchParams.toString() });
      }}>
      {({ setValues }: FormikHelpers<SearchConfig>) => (
        <Form style={{ width: '100%' }}>
          <StyledPageWithSideMenu>
            <SideMenu>
              <SideNavHeader icon={SearchIcon} text={t('common.search')} />
              <NavigationListAccordion
                title={t('common.filter')}
                startIcon={<FilterIcon sx={{ bgcolor: 'white' }} />}
                accordionPath=""
                expanded={isOnSearchPage}
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

              <NavigationListAccordion
                title={t('search.reports.reports')}
                startIcon={<InsightsIcon sx={{ bgcolor: 'white' }} />}
                accordionPath={UrlPathTemplate.Reports}
                dataTestId={dataTestId.startPage.reportsAccordion}
                onClick={() => setValues(emptySearchParams)}>
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
                  <SearchPage
                    registrationQuery={registrationQuery}
                    personQuery={personQuery}
                    projectQuery={projectQuery}
                  />
                </Route>
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
        </Form>
      )}
    </Formik>
  );
};

export default HomePage;
