import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { RegistrationSearchResults } from './RegistrationSearchResults';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { Registration } from '../../../types/registration.types';
import { SearchListPaging } from '../SearchListPaging';
import { SearchResponse } from '../../../types/common.types';

interface RegistrationSearchProps {
  searchResults?: SearchResponse<Registration>;
  isLoadingSearch: boolean;
}

export const RegistrationSearch = ({ searchResults, isLoadingSearch }: RegistrationSearchProps) => {
  const { t } = useTranslation();

  return (
    <Box gridArea="results">
      {isLoadingSearch && !searchResults ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : searchResults && searchResults.hits.length > 0 ? (
        <>
          <RegistrationSearchResults searchResult={searchResults} />
          <SearchListPaging totalCount={searchResults.size} />
        </>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}
    </Box>
  );
};
