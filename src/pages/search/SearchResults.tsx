import { useTranslation } from 'react-i18next';
import { Box, Divider, Typography } from '@mui/material';
import { RegistrationList } from '../../components/RegistrationList';
import { SearchResponse } from '../../types/common.types';
import { Registration } from '../../types/registration.types';

interface SearchResultsProps {
  searchResult: SearchResponse<Registration>;
}

export const SearchResults = ({ searchResult }: SearchResultsProps) => {
  const { t } = useTranslation('search');

  return (
    <Box data-testid="search-results" sx={{ pb: '1rem' }}>
      <Typography variant="subtitle1">{t('hits', { count: searchResult.total })}:</Typography>
      <Divider />
      <RegistrationList registrations={searchResult.hits} />
    </Box>
  );
};
