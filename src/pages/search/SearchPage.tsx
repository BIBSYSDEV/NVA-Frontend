import { Formik, Form, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import SubjectIcon from '@mui/icons-material/Subject';
import PersonIcon from '@mui/icons-material/Person';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import { Box, Button, Divider, Typography } from '@mui/material';
import { RegistrationSearchBar } from './registration_search/RegistrationSearchBar';
import {
  createSearchConfigFromSearchParams,
  createRegistrationSearchQuery,
  SearchConfig,
  SearchParam,
  emptySearchConfig,
} from '../../utils/searchHelpers';
import { RegistrationFacetsFilter } from './registration_search/filters/RegistrationFacetsFilter';
import { RegistrationSearch } from './registration_search/RegistrationSearch';
import { SearchResponse } from '../../types/common.types';
import { Registration } from '../../types/registration.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { SearchApiPath } from '../../api/apiPaths';
import { SidePanel, SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { PersonSearch } from './person_search/PersonSearch';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { ProjectSearch } from './project_search/ProjectSearch';

/*
 * The Search Page allows for users to search for 3 things (types): Registrations/Results, Persons, and Projects
 * The actual flow may not be 100% obvious, but the process is simply speaking along these lines:
 *   1) Search inputs (query and filters) are added to Formik
 *   2) User submits the form
 *   3) The form's submit function builds the search query string to add to the URL based on the form values
 *   4) When the URL Search params are updated, a new search will be performed
 */

enum SearchTypeValue {
  Result = 'result',
  Person = 'person',
  Project = 'project',
}

const defaultResultSize = ROWS_PER_PAGE_OPTIONS[1].toString();

const SearchPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const paramsSearchType = params.get(SearchParam.Type);

  const resultIsSelected = !paramsSearchType || paramsSearchType === SearchTypeValue.Result;
  const personIsSeleced = paramsSearchType === SearchTypeValue.Person;
  const projectIsSelected = paramsSearchType === SearchTypeValue.Project;

  const requestParams = new URLSearchParams(history.location.search);
  requestParams.delete(SearchParam.Type);
  const [searchResults, isLoadingSearch] = useFetch<SearchResponse<Registration>>({
    url: resultIsSelected ? `${SearchApiPath.Registrations}?${requestParams.toString()}` : '',
    errorMessage: t('feedback.error.search'),
  });

  const initialSearchParams = createSearchConfigFromSearchParams(params);

  return (
    <Formik
      initialValues={initialSearchParams}
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
      {({ setValues }: FormikProps<SearchConfig>) => (
        <Form style={{ width: '100%' }}>
          <StyledPageWithSideMenu>
            <SidePanel>
              <SideNavHeader icon={SearchIcon} text={t('common.search')} />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  button: { textTransform: 'none' },
                  m: '1rem',
                }}>
                <Button
                  variant={resultIsSelected ? 'contained' : 'outlined'}
                  onClick={() => {
                    if (!resultIsSelected) {
                      const resultParams = new URLSearchParams();
                      history.push({ search: resultParams.toString() });
                      setValues(emptySearchConfig);
                    }
                  }}
                  color="registration"
                  sx={{
                    width: 'fit-content',
                    color: 'common.black',
                    bgcolor: resultIsSelected ? undefined : 'background.default',
                    borderColor: 'registration.main',
                  }}
                  startIcon={<SubjectIcon />}>
                  {t('search.result')}
                </Button>
                <Button
                  variant={personIsSeleced ? 'contained' : 'outlined'}
                  onClick={() => {
                    if (!personIsSeleced) {
                      const personParams = new URLSearchParams();
                      personParams.set(SearchParam.Type, SearchTypeValue.Person);
                      history.push({ search: personParams.toString() });
                      setValues(emptySearchConfig);
                    }
                  }}
                  color="person"
                  sx={{
                    width: 'fit-content',
                    color: 'common.black',
                    bgcolor: personIsSeleced ? undefined : 'background.default',
                    borderColor: 'person.main',
                  }}
                  startIcon={<PersonIcon />}>
                  {t('search.persons')}
                </Button>
                <Button
                  variant={projectIsSelected ? 'contained' : 'outlined'}
                  onClick={() => {
                    if (!projectIsSelected) {
                      const projectParams = new URLSearchParams();
                      projectParams.set(SearchParam.Type, SearchTypeValue.Project);
                      history.push({ search: projectParams.toString() });
                      setValues(emptySearchConfig);
                    }
                  }}
                  color="project"
                  sx={{
                    width: 'fit-content',
                    color: 'common.black',
                    bgcolor: projectIsSelected ? undefined : 'background.default',
                    borderColor: 'project.main',
                  }}
                  startIcon={<ShowChartIcon />}>
                  {t('project.project')}
                </Button>
              </Box>

              {resultIsSelected && searchResults?.aggregations && (
                <>
                  <Divider />
                  <Box sx={{ m: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h2">{t('search.search_filter')}</Typography>
                    <FilterAltOutlined />
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      m: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}>
                    <RegistrationFacetsFilter
                      aggregations={searchResults.aggregations}
                      isLoadingSearch={isLoadingSearch}
                    />
                  </Box>
                </>
              )}
            </SidePanel>

            {resultIsSelected && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateRows: 'auto auto 1fr',
                  gridTemplateColumns: { xs: '1fr', md: '5fr 2fr' },
                  gridTemplateAreas: {
                    xs: "'searchbar' 'sorting' 'advanced' 'results'",
                    md: "'searchbar sorting' 'advanced advanced' 'results results'",
                  },
                  columnGap: '2rem',
                  rowGap: '1rem',
                }}>
                <RegistrationSearchBar />
                <RegistrationSearch searchResults={searchResults} isLoadingSearch={isLoadingSearch} />
              </Box>
            )}
            {personIsSeleced && <PersonSearch />}
            {projectIsSelected && <ProjectSearch />}
          </StyledPageWithSideMenu>
        </Form>
      )}
    </Formik>
  );
};

export default SearchPage;
