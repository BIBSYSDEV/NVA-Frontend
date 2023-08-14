import { Box } from '@mui/material';
import { useEffect } from 'react';
import { RegistrationList } from '../../../components/RegistrationList';
import { RegistrationSearchResponse } from '../../../types/registration.types';
import { stringIncludesMathJax, typesetMathJax } from '../../../utils/mathJaxHelpers';

interface SearchResultsProps {
  searchResult: RegistrationSearchResponse;
  canEditRegistration?: boolean;
}

export const RegistrationSearchResults = ({ searchResult, canEditRegistration = false }: SearchResultsProps) => {
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
      <RegistrationList canEditRegistration={canEditRegistration} registrations={searchResult.hits} />
    </Box>
  );
};
