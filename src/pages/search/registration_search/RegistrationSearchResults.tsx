import { useEffect } from 'react';
import { RegistrationList } from '../../../components/RegistrationList';
import { RegistrationSearchItem } from '../../../types/registration.types';
import { stringIncludesMathJax, typesetMathJax } from '../../../utils/mathJaxHelpers';

interface SearchResultsProps {
  searchResult: RegistrationSearchItem[];
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
    <RegistrationList
      canEditRegistration={canEditRegistration}
      registrations={searchResult}
      promotedPublications={promotedPublications}
    />
  );
};
