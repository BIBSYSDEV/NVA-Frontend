import { TextFieldProps } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { PersonSearchParameter, ProjectSearchParameter } from '../../api/cristinApi';
import { ResultParam } from '../../api/searchApi';
import { SearchParam, syncParamsWithSearchFields } from '../../utils/searchHelpers';
import { SearchTypeDropdown } from './SearchTypeDropdown';

export enum SearchTypeValue {
  Result = 'registration',
  Person = 'person',
  Project = 'project',
}

export const getSyncedSearchTerm = (params: URLSearchParams, searchType: SearchTypeValue) => {
  const syncedParams = syncParamsWithSearchFields(params);
  switch (searchType) {
    case SearchTypeValue.Result:
      return syncedParams.get(ResultParam.Query);
    case SearchTypeValue.Person:
      return syncedParams.get(PersonSearchParameter.Name);
    case SearchTypeValue.Project:
      return syncedParams.get(ProjectSearchParameter.Query);
    default:
      return '';
  }
};

export const SearchTypeField = ({ sx = {} }: Pick<TextFieldProps, 'sx'>) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paramsSearchType = (params.get(SearchParam.Type) as SearchTypeValue | null) ?? SearchTypeValue.Result;

  const resultIsSelected = !paramsSearchType || paramsSearchType === SearchTypeValue.Result;
  const personIsSelected = paramsSearchType === SearchTypeValue.Person;
  const projectIsSelected = paramsSearchType === SearchTypeValue.Project;

  return (
    <SearchTypeDropdown
      sx={sx}
      selectedValue={paramsSearchType}
      onSearchTypeChanged={(searchType) => {
        const searchParams = new URLSearchParams();
        if (searchType === SearchTypeValue.Result && !resultIsSelected) {
          const searchTerm = getSyncedSearchTerm(params, paramsSearchType);
          if (searchTerm) {
            searchParams.set(ResultParam.Query, searchTerm);
          }
        } else if (searchType === SearchTypeValue.Person && !personIsSelected) {
          searchParams.set(SearchParam.Type, SearchTypeValue.Person);
          const searchTerm = getSyncedSearchTerm(params, paramsSearchType);
          if (searchTerm) {
            searchParams.set(PersonSearchParameter.Name, searchTerm);
          }
        } else if (searchType === SearchTypeValue.Project && !projectIsSelected) {
          searchParams.set(SearchParam.Type, SearchTypeValue.Project);
          const searchTerm = getSyncedSearchTerm(params, paramsSearchType);
          if (searchTerm) {
            searchParams.set(ProjectSearchParameter.Query, searchTerm);
          }
        }
        navigate({ search: searchParams.toString() });
      }}
    />
  );
};
