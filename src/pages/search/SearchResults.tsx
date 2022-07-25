import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Divider, Typography } from '@mui/material';
import { RegistrationList } from '../../components/RegistrationList';
import { SearchResponse } from '../../types/common.types';
import { Registration } from '../../types/registration.types';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';

interface SearchResultsProps {
  searchResult: SearchResponse<Registration>;
}

export const SearchResults = ({ searchResult }: SearchResultsProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (
      searchResult.hits.some(
        ({ entityDescription }) =>
          stringIncludesMathJax(entityDescription?.mainTitle) || stringIncludesMathJax(entityDescription?.abstract)
      )
    ) {
      typesetMathJax();
    }
  }, [searchResult]);

  return (
    <Box data-testid="search-results" sx={{ pb: '1rem' }}>
      <Typography variant="subtitle1">{t('search.hits', { count: searchResult.size })}:</Typography>
      <Divider />
      <RegistrationList registrations={searchResult.hits} />
    </Box>
  );
};
