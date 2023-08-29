import { Box } from '@mui/material';
import { useEffect } from 'react';
import { RegistrationList } from '../../../components/RegistrationList';
import { SearchResponse } from '../../../types/common.types';
import { Registration, RegistrationAggregations } from '../../../types/registration.types';
import { stringIncludesMathJax, typesetMathJax } from '../../../utils/mathJaxHelpers';

interface SearchResultsProps {
  searchResult: SearchResponse<Registration, RegistrationAggregations>;
  canEditRegistration?: boolean;
  promotedPublications?: string[] | undefined;
  personId?: string;
}

export const RegistrationSearchResults = ({
  searchResult,
  canEditRegistration = false,
  promotedPublications,
  personId,
}: SearchResultsProps) => {
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
      <RegistrationList
        canEditRegistration={canEditRegistration}
        registrations={searchResult.hits}
        promotedPublications={promotedPublications}
      />
    </Box>
  );
};
