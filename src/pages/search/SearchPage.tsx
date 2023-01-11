import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { Box, Button } from '@mui/material';
import { SearchBar } from './SearchBar';
import { createSearchConfigFromSearchParams, createSearchQuery, SearchParam } from '../../utils/searchHelpers';
import { RegistrationFacetsFilter } from './filters/RegistrationFacetsFilter';
import { RegistrationSearch } from './RegistrationSearch';
import { SortSelector } from './SortSelector';
import { SearchResponse } from '../../types/common.types';
import { Registration } from '../../types/registration.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { SearchApiPath } from '../../api/apiPaths';
import { SidePanel, SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { useState } from 'react';
import { PersonSearch } from './person_search/PersonSearch';

const SearchPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const [searchContext, setSearchContext] = useState<'Result' | 'Person'>('Result'); // TODO: Set this in URL path

  const [searchResults, isLoadingSearch] = useFetch<SearchResponse<Registration>>({
    url: `${SearchApiPath.Registrations}?${params.toString()}`,
    errorMessage: t('feedback.error.search'),
  });

  const initialSearchParams = createSearchConfigFromSearchParams(params);

  return (
    <Formik
      initialValues={initialSearchParams}
      onSubmit={(values) => {
        const queryString = createSearchQuery(values);
        params.set(SearchParam.From, '0');
        if (queryString) {
          params.set(SearchParam.Query, queryString);
        } else {
          params.delete(SearchParam.Query);
        }
        history.push({ search: params.toString() });
      }}>
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
                variant={searchContext === 'Result' ? 'contained' : 'outlined'}
                onClick={() => setSearchContext('Result')}
                color="registration"
                sx={{ width: 'fit-content' }}
                startIcon={<ManageSearchIcon />}>
                {t('search.result')}
              </Button>
              <Button
                variant={searchContext === 'Person' ? 'contained' : 'outlined'}
                onClick={() => setSearchContext('Person')}
                color="person"
                sx={{ width: 'fit-content' }}
                startIcon={<PersonSearchIcon />}>
                {t('search.persons')}
              </Button>

              {searchContext === 'Result' && searchResults?.aggregations && (
                <RegistrationFacetsFilter aggregations={searchResults.aggregations} isLoadingSearch={isLoadingSearch} />
              )}
            </Box>
          </SidePanel>
          {searchContext === 'Result' ? (
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
              <SearchBar />
              <SortSelector />
              <RegistrationSearch searchResults={searchResults} isLoadingSearch={isLoadingSearch} />
            </Box>
          ) : (
            <PersonSearch />
          )}
        </StyledPageWithSideMenu>
      </Form>
    </Formik>
  );
};

export default SearchPage;
