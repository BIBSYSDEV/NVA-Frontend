import { Box, List, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { SearchBar } from './SearchBar';
import { SyledPageContent } from '../../components/styled/Wrappers';
import { createSearchConfigFromSearchParams, createSearchQuery, SearchParam } from '../../utils/searchHelpers';
import { RegistrationTypeFilter } from './filters/RegistrationTypeFilter';
import { RegistrationSearch } from './RegistrationSearch';
import { SortSelector } from './SortSelector';

const SearchPage = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  const initialSearchParams = createSearchConfigFromSearchParams(params);

  return (
    <SyledPageContent>
      <PageHeader>{t('registrations')}</PageHeader>
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
          <Box
            sx={{
              display: 'grid',
              gridTemplateRows: 'auto auto 1fr',
              gridTemplateColumns: { xs: '1fr', md: '2fr 5fr 2fr' },
              gridTemplateAreas: {
                xs: "'searchbar' 'sorting' 'filters' 'advanced' 'results'",
                md: "'filters searchbar sorting' 'filters advanced advanced' 'filters results results'",
              },
              columnGap: '2rem',
              rowGap: '1rem',
            }}>
            <List sx={{ gridArea: 'filters' }}>
              <Typography fontWeight={500}>{t('search:select_filters')}</Typography>
              <RegistrationTypeFilter />
            </List>
            <SearchBar />
            <SortSelector />
            <RegistrationSearch />
          </Box>
        </Form>
      </Formik>
    </SyledPageContent>
  );
};

export default SearchPage;
