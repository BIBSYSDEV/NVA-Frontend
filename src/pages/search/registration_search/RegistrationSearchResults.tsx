import { useEffect } from 'react';
import { Box } from '@mui/material';
import { RegistrationList } from '../../../components/RegistrationList';
import { RegistrationSearchResponse } from '../../../types/registration.types';
import { stringIncludesMathJax, typesetMathJax } from '../../../utils/mathJaxHelpers';

interface SearchResultsProps {
  searchResult: RegistrationSearchResponse;
}

export const RegistrationSearchResults = ({ searchResult }: SearchResultsProps) => {
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
    <Box data-testid="search-results">
      <RegistrationList registrations={searchResult.hits} />
    </Box>
  );
};
