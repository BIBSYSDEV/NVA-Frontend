import { Formik, Form, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { Box, Button } from '@mui/material';
import { RegistrationSearchBar } from './registration_search/RegistrationSearchBar';
import {
  createSearchConfigFromSearchParams,
  createSearchQuery as createRegistrationSearchQuery,
  SearchConfig,
  SearchParam,
} from '../../utils/searchHelpers';
import { RegistrationFacetsFilter } from './registration_search/filters/RegistrationFacetsFilter';
import { RegistrationSearch } from './registration_search/RegistrationSearch';
import { RegistrationSortSelector } from './registration_search/RegistrationSortSelector';
import { SearchResponse } from '../../types/common.types';
import { Registration } from '../../types/registration.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { SearchApiPath } from '../../api/apiPaths';
import { SidePanel, SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { PersonSearch } from './person_search/PersonSearch';
import { BetaFunctionality } from '../../components/BetaFunctionality';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';

/*
 * The Search Page allows for users to search for 3 things (contexts): Registrations/Results, Persons, and Projects
 * The actual flow may not be 100% obvious, but the process is simply speaking along these lines:
 *   1) Search inputs (query and filters) are added to Formik
 *   2) User submits the form
 *   3) The form's submit function builds the search query string to add to the URL based on the form values
 *   4) When the URL Search params are updated, a new search will be performed
 */

enum SearchContextValue {
  Result = 'result',
  Person = 'person',
}

const defaultResultSize = ROWS_PER_PAGE_OPTIONS[1].toString();

const SearchPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const paramsSearchContext = params.get(SearchParam.Context);
  const searchContext =
    paramsSearchContext === SearchContextValue.Person ? SearchContextValue.Person : SearchContextValue.Result;

  const requestParams = new URLSearchParams(history.location.search);
  requestParams.delete(SearchParam.Context);
  const [searchResults, isLoadingSearch] = useFetch<SearchResponse<Registration>>({
    url:
      searchContext === SearchContextValue.Result ? `${SearchApiPath.Registrations}?${requestParams.toString()}` : '',
    errorMessage: t('feedback.error.search'),
  });

  const initialSearchParams = createSearchConfigFromSearchParams(params);

  return (
    <Formik
      initialValues={initialSearchParams}
      onSubmit={(values) => {
        const newSearchParams = new URLSearchParams();
        if (searchContext === SearchContextValue.Result) {
          const queryString = createRegistrationSearchQuery(values);
          if (queryString) {
            newSearchParams.set(SearchParam.Query, queryString);
          }
          newSearchParams.set(SearchParam.Results, defaultResultSize);
          newSearchParams.set(SearchParam.From, '0');
        } else if (searchContext === SearchContextValue.Person) {
          newSearchParams.set(SearchParam.Context, SearchContextValue.Person);
          if (values.searchTerm) {
            newSearchParams.set(SearchParam.Page, '1');
            newSearchParams.set(SearchParam.Results, defaultResultSize);
            newSearchParams.set(SearchParam.Name, values.searchTerm);
          }
        }
        history.push({ search: newSearchParams.toString() });
      }}>
      {({ resetForm }: FormikProps<SearchConfig>) => (
        <Form>
          <StyledPageWithSideMenu>
            <SidePanel>
              <SideNavHeader icon={SearchIcon} text={t('common.search')} />
              <Box
                sx={{
                  m: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  button: { textTransform: 'none' },
                }}>
                <Button
                  variant={searchContext === SearchContextValue.Result ? 'contained' : 'outlined'}
                  onClick={() => {
                    if (searchContext !== SearchContextValue.Result) {
                      const resultParams = new URLSearchParams();
                      history.push({ search: resultParams.toString() });
                      resetForm();
                    }
                  }}
                  color="registration"
                  sx={{ width: 'fit-content' }}
                  startIcon={<ManageSearchIcon />}>
                  {t('search.result')}
                </Button>
                <BetaFunctionality>
                  <Button
                    variant={searchContext === SearchContextValue.Person ? 'contained' : 'outlined'}
                    onClick={() => {
                      if (searchContext !== SearchContextValue.Person) {
                        const personParams = new URLSearchParams();
                        personParams.set(SearchParam.Context, SearchContextValue.Person);
                        history.push({ search: personParams.toString() });
                        resetForm();
                      }
                    }}
                    color="person"
                    sx={{ width: 'fit-content' }}
                    startIcon={<PersonSearchIcon />}>
                    {t('search.persons')}
                  </Button>
                </BetaFunctionality>

                {searchContext === SearchContextValue.Result && searchResults?.aggregations && (
                  <RegistrationFacetsFilter
                    aggregations={searchResults.aggregations}
                    isLoadingSearch={isLoadingSearch}
                  />
                )}
              </Box>
            </SidePanel>
            {searchContext === SearchContextValue.Result ? (
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
                <RegistrationSortSelector />
                <RegistrationSearch searchResults={searchResults} isLoadingSearch={isLoadingSearch} />
              </Box>
            ) : (
              <PersonSearch />
            )}
          </StyledPageWithSideMenu>
        </Form>
      )}
    </Formik>
  );
};

export default SearchPage;
