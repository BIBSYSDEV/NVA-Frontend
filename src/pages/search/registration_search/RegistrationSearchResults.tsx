import { Box } from '@mui/material';
import { useEffect } from 'react';
import { RegistrationList } from '../../../components/RegistrationList';
import { Registration } from '../../../types/registration.types';
import { stringIncludesMathJax, typesetMathJax } from '../../../utils/mathJaxHelpers';

interface SearchResultsProps {
  searchResult: Registration[];
  canEditRegistration?: boolean;
  promotedPublications?: string[];
}

export const RegistrationSearchResults = ({
  searchResult,
  canEditRegistration = false,
  promotedPublications = [],
}: SearchResultsProps) => {
  useEffect(() => {
    if (
      searchResult.some(
        ({ entityDescription }) =>
          stringIncludesMathJax(entityDescription?.mainTitle) || stringIncludesMathJax(entityDescription?.abstract)
      )
    ) {
      typesetMathJax();
    }
  }, [searchResult]);

  return (
    <Box data-testid="search-results">
      <RegistrationList
        canEditRegistration={canEditRegistration}
        registrations={searchResult}
        promotedPublications={promotedPublications}
      />
    </Box>
  );
};
