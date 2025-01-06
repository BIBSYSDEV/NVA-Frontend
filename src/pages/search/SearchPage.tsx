import { Box, styled } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PersonSearchParameter, ProjectSearchParameter } from '../../api/cristinApi';
import { SearchForm } from '../../components/SearchForm';
import { SearchResponse, SearchResponse2 } from '../../types/common.types';
import { CristinProject, ProjectAggregations } from '../../types/project.types';
import { RegistrationAggregations, RegistrationSearchItem } from '../../types/registration.types';
import { CristinPerson, PersonAggregations } from '../../types/user.types';
import { SearchParam } from '../../utils/searchHelpers';
import { PersonSearch } from './person_search/PersonSearch';
import { ProjectSearch } from './project_search/ProjectSearch';
import { RegistrationSearch } from './registration_search/RegistrationSearch';
import { RegistrationSearchBar } from './registration_search/RegistrationSearchBar';
import { SearchTypeField, SearchTypeValue } from './SearchTypeField';

const StyledSearchBarContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },

  gap: '0.75rem 0.5rem',

  margin: '0 0 1rem 0',
  [theme.breakpoints.down('md')]: {
    margin: '0 0.5rem 1rem 0.5rem',
  },
}));

export interface SearchPageProps {
  registrationQuery: UseQueryResult<SearchResponse2<RegistrationSearchItem, RegistrationAggregations>>;
  personQuery: UseQueryResult<SearchResponse<CristinPerson, PersonAggregations>>;
  projectQuery: UseQueryResult<SearchResponse<CristinProject, ProjectAggregations>>;
}

export const SearchPage = ({ registrationQuery, personQuery, projectQuery }: SearchPageProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const paramsSearchType = params.get(SearchParam.Type);

  const resultIsSelected = !paramsSearchType || paramsSearchType === SearchTypeValue.Result;
  const personIsSeleced = paramsSearchType === SearchTypeValue.Person;
  const projectIsSelected = paramsSearchType === SearchTypeValue.Project;

  return (
    <Box sx={{ mb: { xs: '0.5rem', md: 0 } }}>
      {resultIsSelected && (
        <>
          <RegistrationSearchBar registrationQuery={registrationQuery} />
          <RegistrationSearch registrationQuery={registrationQuery} />
        </>
      )}
      {personIsSeleced && (
        <>
          <StyledSearchBarContainer>
            <SearchTypeField />
            <SearchForm paramName={PersonSearchParameter.Name} placeholder={t('search.person_search_placeholder')} />
          </StyledSearchBarContainer>
          <PersonSearch personQuery={personQuery} />
        </>
      )}
      {projectIsSelected && (
        <>
          <StyledSearchBarContainer>
            <SearchTypeField />
            <SearchForm paramName={ProjectSearchParameter.Query} placeholder={t('search.search_project_placeholder')} />
          </StyledSearchBarContainer>
          <ProjectSearch projectQuery={projectQuery} />
        </>
      )}
    </Box>
  );
};
