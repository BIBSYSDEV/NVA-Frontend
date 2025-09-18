import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { SearchTypeDropdown, SearchTypeValue } from '../search/SearchTypeDropdown';
import { Box, Button, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { dataTestId } from '../../utils/dataTestIds';
import { SearchTextField } from '../search/SearchTextField';
import EastIcon from '@mui/icons-material/East';
import { UrlPathTemplate } from '../../utils/urlPaths';

const getCorrectParameters = (inputValue: string, searchType: SearchTypeValue) => {
  switch (searchType) {
    case SearchTypeValue.Result:
      return inputValue ? `query=${inputValue}` : '';
    case SearchTypeValue.Person:
      return `type=person${inputValue ? `&name=${inputValue}` : ''}`;
    case SearchTypeValue.Project:
      return `type=project${inputValue ? `&multiple=${inputValue}` : ''}`;
    default:
      return '';
  }
};

export const SearchSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedSearchType, setSelectedSearchType] = useState(SearchTypeValue.Result);
  const [inputValue, setInputValue] = useState('');

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const searchTerm = getCorrectParameters(inputValue, selectedSearchType);
    navigate({ pathname: UrlPathTemplate.Root, search: searchTerm });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        width: '100%',
        bgcolor: '#D9D9D9',
        borderRadius: '1rem',
        p: '2rem 3rem',
      }}>
      <Box sx={{ display: 'flex', gap: '0.75rem' }} component="form" onSubmit={onSubmit}>
        <SearchTypeDropdown
          selectedValue={selectedSearchType}
          onSelectResult={() => setSelectedSearchType(SearchTypeValue.Result)}
          onSelectPerson={() => setSelectedSearchType(SearchTypeValue.Person)}
          onSelectProject={() => setSelectedSearchType(SearchTypeValue.Project)}
        />
        <SearchTextField
          dataTestId={dataTestId.frontPage.searchInputField}
          placeholder={t('search.search_placeholder')}
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
          startIcon={<SearchIcon />}
          aria-label={t('common.search')}>
          {t('common.search').toUpperCase()}
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
        <Button
          variant="text"
          data-testid={dataTestId.frontPage.advancedSearchButton}
          sx={{ display: 'flex', gap: '0.25rem' }}
          onClick={() => {
            navigate({ pathname: UrlPathTemplate.Search });
          }}
          aria-label={t('go_to_advanced_search')}>
          <Typography sx={{ color: '#120732', textDecoration: 'underline' }}>{t('go_to_advanced_search')}</Typography>
          <EastIcon sx={{ fontSize: '1.25rem' }} />
        </Button>
      </Box>
    </Box>
  );
};
