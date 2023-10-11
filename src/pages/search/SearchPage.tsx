import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import NotesIcon from '@mui/icons-material/Notes';
import PersonIcon from '@mui/icons-material/Person';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { Box, Divider, MenuItem, TextField } from '@mui/material';
import { Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { SearchApiPath } from '../../api/apiPaths';
import { SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { SideMenu } from '../../components/SideMenu';
import { SearchResponse } from '../../types/common.types';
import { Registration, RegistrationAggregations } from '../../types/registration.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { useFetch } from '../../utils/hooks/useFetch';
import {
  SearchConfig,
  SearchParam,
  createRegistrationSearchQuery,
  createSearchConfigFromSearchParams,
  emptySearchConfig,
} from '../../utils/searchHelpers';
import { PersonSearch } from './person_search/PersonSearch';
import { ProjectSearch } from './project_search/ProjectSearch';
import { RegistrationSearch } from './registration_search/RegistrationSearch';
import { RegistrationSearchBar } from './registration_search/RegistrationSearchBar';
import { RegistrationFacetsFilter } from './registration_search/filters/RegistrationFacetsFilter';

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

const defaultResultSize = ROWS_PER_PAGE_OPTIONS[0].toString();

const SearchPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const paramsSearchType = params.get(SearchParam.Type);
  const [selectedSearchType, setSelectedSearchType] = useState(SearchTypeValue.Result);

  const resultIsSelected = !paramsSearchType || paramsSearchType === SearchTypeValue.Result;
  const personIsSeleced = paramsSearchType === SearchTypeValue.Person;
  const projectIsSelected = paramsSearchType === SearchTypeValue.Project;

  const requestParams = new URLSearchParams(history.location.search);
  requestParams.delete(SearchParam.Type);
  const [searchResults, isLoadingSearch] = useFetch<SearchResponse<Registration, RegistrationAggregations>>({
    url: resultIsSelected ? `${SearchApiPath.Registrations}?${requestParams.toString()}` : '',
    errorMessage: t('feedback.error.search'),
  });

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
      {({ setValues }: FormikProps<SearchConfig>) => (
        <Form style={{ width: '100%' }}>
          <StyledPageWithSideMenu>
            <SideMenu>
              <SideNavHeader icon={FilterAltOutlined} text={t('common.filter')} />
              <Box
                sx={{
                  m: '1rem',
                }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={selectedSearchType}
                  onChange={(event) => setSelectedSearchType(event.target.value as SearchTypeValue)}
                  sx={{
                    '.MuiSelect-select': {
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                      bgcolor: personIsSeleced || projectIsSelected ? `${paramsSearchType}.main` : 'registration.main',
                    },
                  }}
                  inputProps={{ 'aria-label': t('common.filter') }}>
                  <MenuItem
                    sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                    value={SearchTypeValue.Result}
                    onClick={() => {
                      if (!resultIsSelected) {
                        const resultParams = new URLSearchParams();
                        history.push({ search: resultParams.toString() });
                        setValues(emptySearchConfig);
                      }
                    }}>
                    <NotesIcon fontSize="small" />
                    {t('search.result')}
                  </MenuItem>
                  <MenuItem
                    sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                    value={SearchTypeValue.Person}
                    onClick={() => {
                      if (!personIsSeleced) {
                        const personParams = new URLSearchParams();
                        personParams.set(SearchParam.Type, SearchTypeValue.Person);
                        history.push({ search: personParams.toString() });
                        setValues(emptySearchConfig);
                      }
                    }}>
                    <PersonIcon />
                    {t('search.persons')}
                  </MenuItem>
                  <MenuItem
                    sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                    value={SearchTypeValue.Project}
                    onClick={() => {
                      if (!projectIsSelected) {
                        const projectParams = new URLSearchParams();
                        projectParams.set(SearchParam.Type, SearchTypeValue.Project);
                        history.push({ search: projectParams.toString() });
                        setValues(emptySearchConfig);
                      }
                    }}>
                    <ShowChartIcon />
                    {t('project.project')}
                  </MenuItem>
                </TextField>
              </Box>

              {resultIsSelected && searchResults?.aggregations && (
                <>
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
            </SideMenu>

            <Box sx={{ mb: { xs: '0.5rem', md: 0 } }}>
              {resultIsSelected && (
                <>
                  <RegistrationSearchBar aggregations={searchResults?.aggregations} />
                  <RegistrationSearch searchResults={searchResults} isLoadingSearch={isLoadingSearch} />
                </>
              )}
              {personIsSeleced && <PersonSearch />}
              {projectIsSelected && <ProjectSearch />}
            </Box>
          </StyledPageWithSideMenu>
        </Form>
      )}
    </Formik>
  );
};

export default SearchPage;
