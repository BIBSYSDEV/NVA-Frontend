import { Box, styled, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { useLocation, useOutletContext } from 'react-router';
import { PersonSearchParameter, ProjectSearchParameter } from '../../api/cristinApi';
import { SearchForm } from '../../components/SearchForm';
import { SearchParam } from '../../utils/searchHelpers';
import { PersonSearch } from './person_search/PersonSearch';
import { ProjectSearch } from './project_search/ProjectSearch';
import { RegistrationSearch } from './registration_search/RegistrationSearch';
import { RegistrationSearchBar } from './registration_search/RegistrationSearchBar';
import { SearchTypeField, SearchTypeValue } from './SearchTypeField';
import { SelectedPersonFacetsList } from './selected_facets/SelectedPersonFacetsList';
import { SelectedProjectFacetsList } from './selected_facets/SelectedProjectFacetsList';
import { SelectedResultFacetsList } from './selected_facets/SelectedResultFacetsList';
import { SearchPropTypes } from './registration_search/RegistrationSearch.tsx';

const StyledSearchBarContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
  gap: '0.75rem 0.5rem',
}));

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',

  marginBottom: '0.75rem',
  [theme.breakpoints.down('md')]: {
    margin: '0 0.5rem 0.75rem 0.5rem',
  },
}));

const SearchPage = () => {
  const { t } = useTranslation();
  const { registrationQuery, personQuery, projectQuery } = useOutletContext<SearchPropTypes>();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paramsSearchType = params.get(SearchParam.Type);

  const resultIsSelected = !paramsSearchType || paramsSearchType === SearchTypeValue.Result;
  const personIsSeleced = paramsSearchType === SearchTypeValue.Person;
  const projectIsSelected = paramsSearchType === SearchTypeValue.Project;

  return (
    <Box sx={{ mb: { xs: '0.5rem', md: 0 } }}>
      {resultIsSelected && (
        <>
          <Typography variant="h1" sx={visuallyHidden}>
            {t('search.result_search')}
          </Typography>
          <StyledContainer>
            <RegistrationSearchBar />
            {!registrationQuery.isPending && (
              <SelectedResultFacetsList aggregations={registrationQuery.data?.aggregations} />
            )}
          </StyledContainer>
          <RegistrationSearch registrationQuery={registrationQuery} />
        </>
      )}
      {personIsSeleced && (
        <>
          <Typography variant="h1" sx={visuallyHidden}>
            {t('search.person_search')}
          </Typography>
          <StyledContainer>
            <StyledSearchBarContainer>
              <SearchTypeField />
              <SearchForm
                paramName={PersonSearchParameter.Name}
                placeholder={t('search.person_search_placeholder')}
                paginationOffsetParamName={PersonSearchParameter.Page}
              />
            </StyledSearchBarContainer>
            {!personQuery.isPending && <SelectedPersonFacetsList aggregations={personQuery.data?.aggregations} />}
          </StyledContainer>
          <PersonSearch personQuery={personQuery} />
        </>
      )}
      {projectIsSelected && (
        <>
          <Typography variant="h1" sx={visuallyHidden}>
            {t('search.project_search')}
          </Typography>
          <StyledContainer>
            <StyledSearchBarContainer>
              <SearchTypeField />
              <SearchForm
                paramName={ProjectSearchParameter.Query}
                placeholder={t('search.search_project_placeholder')}
                paginationOffsetParamName={ProjectSearchParameter.Page}
              />
            </StyledSearchBarContainer>
            {!projectQuery.isPending && <SelectedProjectFacetsList aggregations={projectQuery.data?.aggregations} />}
          </StyledContainer>
          <ProjectSearch projectQuery={projectQuery} />
        </>
      )}
    </Box>
  );
};

export default SearchPage;
