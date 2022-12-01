import { Box, Divider, List } from '@mui/material';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { PageHeader } from '../../components/PageHeader';
import { SearchBar } from './SearchBar';
import { BackgroundDiv, SyledPageContent } from '../../components/styled/Wrappers';
import { createSearchConfigFromSearchParams, createSearchQuery, SearchParam } from '../../utils/searchHelpers';
import { RegistrationFacetsFilter } from './filters/RegistrationFacetsFilter';
import { RegistrationSearch } from './RegistrationSearch';
import { SortSelector } from './SortSelector';
import { SearchResponse } from '../../types/common.types';
import { Registration } from '../../types/registration.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { SearchApiPath } from '../../api/apiPaths';
import { SideNav, SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';

const SearchPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  const [searchResults, isLoadingSearch] = useFetch<SearchResponse<Registration>>({
    url: `${SearchApiPath.Registrations}?${params.toString()}`,
    errorMessage: t('feedback.error.search'),
  });

  const initialSearchParams = createSearchConfigFromSearchParams(params);

  return (
    // <SyledPageContent>
    //   <PageHeader>{t('common.registrations')}</PageHeader>
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
          <SideNav>
            <SideNavHeader icon={SearchIcon} text={t('common.search')} />
            <List disablePadding>
              <RegistrationFacetsFilter aggregations={searchResults?.aggregations ?? {}} />
            </List>
          </SideNav>
          <BackgroundDiv>
            <SearchBar />
            <SortSelector />
            <RegistrationSearch searchResults={searchResults} isLoadingSearch={isLoadingSearch} />
          </BackgroundDiv>
        </StyledPageWithSideMenu>

        {/* <Box
          sx={{
            display: 'grid',
            gridTemplateRows: 'auto auto 1fr',
            gridTemplateColumns: { xs: '1fr', md: '2fr auto 5fr 2fr' },
            gridTemplateAreas: {
              xs: "'searchbar' 'sorting' 'filters' 'advanced' 'results'",
              md: "'filters divider searchbar sorting' 'filters divider advanced advanced' 'filters divider results results'",
            },
            columnGap: '2rem',
            rowGap: '1rem',
          }}>
          <>
            <Divider orientation="vertical" sx={{ gridArea: 'divider', display: { xs: 'none', md: 'inline-flex' } }} />
          </>
          <SearchBar />
          <SortSelector />
          <RegistrationSearch searchResults={searchResults} isLoadingSearch={isLoadingSearch} />
        </Box> */}
      </Form>
    </Formik>
    // </SyledPageContent>
  );
};

export default SearchPage;
