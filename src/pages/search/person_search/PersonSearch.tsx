import { Box, List, TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CristinApiPath } from '../../../api/apiPaths';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchResponse } from '../../../types/common.types';
import { CristinPerson } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { useFetch } from '../../../utils/hooks/useFetch';
import { PersonListItem } from './PersonListItem';

export const PersonSearch = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchTerm = useDebounce(searchQuery, 1000);
  const [searchResults, isLoadingSearch] = useFetch<SearchResponse<CristinPerson>>({
    url: debouncedSearchTerm ? `${CristinApiPath.Person}?name=${debouncedSearchTerm}&results=10` : '',
    errorMessage: t('feedback.error.search'),
  });

  return (
    <Box>
      <TextField
        value={searchQuery}
        data-testid={dataTestId.startPage.searchField}
        fullWidth
        onChange={(event) => setSearchQuery(event.target.value)}
        label={t('common.search')}
      />

      {isLoadingSearch ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : (
        <List>
          {searchResults?.hits.map((person) => (
            <PersonListItem key={person.id} person={person} />
          ))}
        </List>
      )}
    </Box>
  );
};
