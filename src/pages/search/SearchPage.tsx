import { Box, styled, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { PersonSearchParameter, ProjectSearchParameter } from '../../api/cristinApi';
import { RegistrationSearchResponse } from '../../api/searchApi';
import { SearchForm } from '../../components/SearchForm';
import { SearchResponse } from '../../types/common.types';
import { CristinProject, ProjectAggregations } from '../../types/project.types';
import { CristinPerson, PersonAggregations } from '../../types/user.types';
import { SearchParam } from '../../utils/searchHelpers';
import { PersonSearch } from './person_search/PersonSearch';
import { ProjectSearch } from './project_search/ProjectSearch';
import { RegistrationSearch } from './registration_search/RegistrationSearch';
import { RegistrationSearchBar } from './registration_search/RegistrationSearchBar';
import { SearchTypeField, SearchTypeValue } from './SearchTypeField';
import { SelectedPersonFacetsList } from './selected_facets/SelectedPersonFacetsList';
import { SelectedProjectFacetsList } from './selected_facets/SelectedProjectFacetsList';
import { SelectedResultFacetsList } from './selected_facets/SelectedResultFacetsList';

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

export interface SearchPageProps {
  registrationQuery: UseQueryResult<RegistrationSearchResponse>;
  personQuery: UseQueryResult<SearchResponse<CristinPerson, PersonAggregations>>;
  projectQuery: UseQueryResult<SearchResponse<CristinProject, ProjectAggregations>>;
}

export const SearchPage = ({ registrationQuery, personQuery, projectQuery }: SearchPageProps) => {
  const { t } = useTranslation();
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
