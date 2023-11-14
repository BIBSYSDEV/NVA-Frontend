import FilterIcon from '@mui/icons-material/FilterAltOutlined';
import InsightsIcon from '@mui/icons-material/Insights';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { SearchApiPath } from '../../api/apiPaths';
import { PersonSearchParameter, PersonSearchParams, searchForPerson } from '../../api/cristinApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { SideMenu } from '../../components/SideMenu';
import { SearchResponse } from '../../types/common.types';
import { Registration, RegistrationAggregations } from '../../types/registration.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { useFetch } from '../../utils/hooks/useFetch';
import {
  SearchConfig,
  SearchParam,
  createRegistrationSearchQuery,
  createSearchConfigFromSearchParams,
} from '../../utils/searchHelpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { StyledSearchModeButton } from '../messages/TasksPage';
import SearchPage from '../search/SearchPage';
import { PersonFacetsFilter } from '../search/person_search/PersonFacetsFilter';
import ReportsPage from '../search/registration_search/ReportsPage';
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
  const requestParamsString = requestParams.toString();
  const [searchResults, isLoadingSearch] = useFetch<SearchResponse<Registration, RegistrationAggregations>>({
    url: resultIsSelected ? `${SearchApiPath.Registrations}?${requestParamsString}` : '',
    errorMessage: t('feedback.error.search'),
  });

  const rowsPerPage = Number(requestParams.get(SearchParam.Results) ?? 10);
  const page = Number(requestParams.get(SearchParam.Page) ?? 1);

  const personQueryParams: PersonSearchParams = {
    name: requestParams.get(PersonSearchParameter.Name) ?? '.',
    organization: requestParams.get(PersonSearchParameter.Organization) ?? undefined,
    sector: requestParams.get(PersonSearchParameter.Sector) ?? undefined,
  };
  const personQuery = useQuery({
    enabled: personIsSeleced,
    queryKey: ['person', rowsPerPage, page, personQueryParams],
    queryFn: () => searchForPerson(rowsPerPage, page, personQueryParams),
    meta: { errorMessage: t('feedback.error.search') },
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
                    searchResults?.aggregations ? (
                      <RegistrationFacetsFilter
                        aggregations={searchResults.aggregations}
                        isLoadingSearch={isLoadingSearch}
                      />
                    ) : null
                  ) : personIsSeleced ? (
                    personQuery.data?.aggregations ? (
                      <PersonFacetsFilter personQuery={personQuery} />
                    ) : null
                  ) : projectIsSelected ? (
                    <Typography fontStyle="italic">{t('search.no_available_filters')}</Typography>
                  ) : null}
                </Box>
              </NavigationListAccordion>

              <NavigationListAccordion
                title={t('search.reports.reports')}
                startIcon={<InsightsIcon sx={{ bgcolor: 'white' }} />}
                accordionPath={UrlPathTemplate.Reports}
                dataTestId={dataTestId.startPage.reportsAccordion}
                onClick={() => {
                  setValues(emptySearchParams);
                }}>
                <StyledSearchModeButton
                  sx={{ mx: '1rem', mb: '1rem' }}
                  data-testid={dataTestId.startPage.nviReportRadioButton}
                  isSelected={currentPath === UrlPathTemplate.Reports}
                  startIcon={<RadioButtonCheckedIcon />}>
                  {t('common.nvi')}
                </StyledSearchModeButton>
              </NavigationListAccordion>
            </SideMenu>

            <Switch>
              <ErrorBoundary>
                <Route exact path={UrlPathTemplate.Home}>
                  <SearchPage
                    searchResults={searchResults}
                    personQuery={personQuery}
                    isLoadingSearch={isLoadingSearch}
                  />
                </Route>
                <Route exact path={UrlPathTemplate.Reports} component={ReportsPage} />
              </ErrorBoundary>
            </Switch>
          </StyledPageWithSideMenu>
        </Form>
      )}
    </Formik>
  );
};

export default HomePage;
