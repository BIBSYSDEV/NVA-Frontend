import { Box, Divider, List } from '@mui/material';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { SearchBar } from './SearchBar';
import { BackgroundDiv, SyledPageContent } from '../../components/styled/Wrappers';
import { createSearchConfigFromSearchParams, createSearchQuery, SearchParam } from '../../utils/searchHelpers';
import { RegistrationTypeFilter } from './filters/RegistrationTypeFilter';
import { RegistrationSearch } from './RegistrationSearch';
import { SortSelector } from './SortSelector';

const SearchPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  const initialSearchParams = createSearchConfigFromSearchParams(params);

  return (
    <SyledPageContent>
      <BackgroundDiv sx={{ bgcolor: 'background.default' }}>
        <PageHeader>{t('common.registrations')}</PageHeader>
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
                gridTemplateColumns: { xs: '1fr', md: '2fr auto 5fr 2fr' },
                gridTemplateAreas: {
                  xs: "'searchbar' 'sorting' 'filters' 'advanced' 'results'",
                  md: "'filters divider searchbar sorting' 'filters divider advanced advanced' 'filters divider results results'",
                },
                columnGap: '2rem',
                rowGap: '1rem',
              }}>
              <>
                <List sx={{ gridArea: 'filters' }}>
                  <RegistrationTypeFilter />
                </List>
                <Divider orientation="vertical" sx={{ gridArea: 'divider' }} />
              </>
              <SearchBar />
              <SortSelector />
              <RegistrationSearch />
            </Box>
          </Form>
        </Formik>
      </BackgroundDiv>
    </SyledPageContent>
  );
};

export default SearchPage;
