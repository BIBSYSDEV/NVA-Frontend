import EastIcon from '@mui/icons-material/East';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Link } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Link as RouterLink, useNavigate } from 'react-router';
import { dataTestId } from '../../utils/dataTestIds';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { SearchTextField } from '../search/SearchTextField';
import { SearchTypeDropdown, SearchTypeValue } from '../search/SearchTypeDropdown';
import { ResultParam } from '../../api/searchApi';
import { PersonSearchParameter, ProjectSearchParameter } from '../../api/cristinApi';
import { SearchParam } from '../../utils/searchHelpers';
import { FrontPageBox } from './styles';

const getSearchParams = (inputValue: string, searchType: SearchTypeValue) => {
  const searchParams = new URLSearchParams();
  switch (searchType) {
    case SearchTypeValue.Result:
      if (inputValue) searchParams.set(ResultParam.Query, inputValue);
      break;
    case SearchTypeValue.Person:
      searchParams.set(SearchParam.Type, SearchTypeValue.Person);
      if (inputValue) searchParams.set(PersonSearchParameter.Name, inputValue);
      break;
    case SearchTypeValue.Project:
      searchParams.set(SearchParam.Type, SearchTypeValue.Project);
      if (inputValue) searchParams.set(ProjectSearchParameter.Query, inputValue);
      break;
  }
  return searchParams;
};

const getCorrectPlaceholder = (searchType: SearchTypeValue, t: TFunction<'translation'>) => {
  switch (searchType) {
    case SearchTypeValue.Result:
      return t('search.search_placeholder');
    case SearchTypeValue.Person:
      return t('search.person_search_placeholder');
    case SearchTypeValue.Project:
      return t('search.search_project_placeholder');
    default:
      return t('search.search_placeholder');
  }
};

export const SearchSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedSearchType, setSelectedSearchType] = useState(SearchTypeValue.Result);
  const [inputValue, setInputValue] = useState('');

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const searchParams = getSearchParams(inputValue, selectedSearchType);
    navigate({ pathname: UrlPathTemplate.Root, search: searchParams.toString() });
  };

  return (
    <FrontPageBox component="search" sx={{ bgcolor: '#D9D9D9' }}>
      <Box
        sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '0.75rem' }}
        component="form"
        onSubmit={onSubmit}>
        <SearchTypeDropdown selectedValue={selectedSearchType} onSearchTypeChanged={setSelectedSearchType} />
        <SearchTextField
          dataTestId={dataTestId.frontPage.searchInputField}
          aria-label={getCorrectPlaceholder(selectedSearchType, t)}
          placeholder={getCorrectPlaceholder(selectedSearchType, t)}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          sx={{ flex: 1, bgcolor: 'white' }}
        />
        <Button
          type="submit"
          sx={{
            padding: '0.25rem 1.25rem',
            maxWidth: '14rem',
            bgcolor: '#5D56F2',
            color: '#EFEFEF',
          }}
          data-testid={dataTestId.frontPage.searchButton}
          startIcon={<SearchIcon />}>
          {t('common.search')}
        </Button>
      </Box>
      {selectedSearchType === SearchTypeValue.Result && (
        <Link
          component={RouterLink}
          data-testid={dataTestId.frontPage.advancedSearchLink}
          to={UrlPathTemplate.Search}
          sx={{ display: 'flex', gap: '0.25rem', alignSelf: 'flex-end', color: '#120732' }}>
          {t('go_to_advanced_search')}
          <EastIcon />
        </Link>
      )}
    </FrontPageBox>
  );
};
