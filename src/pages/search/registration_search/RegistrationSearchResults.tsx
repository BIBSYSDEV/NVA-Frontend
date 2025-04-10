import { useEffect } from 'react';
import { RegistrationList, RegistrationListProps } from '../../../components/RegistrationList';
import { RegistrationSearchItem } from '../../../types/registration.types';
import { stringIncludesMathJax, typesetMathJax } from '../../../utils/mathJaxHelpers';

export interface RegistrationSearchResultsProps extends RegistrationListProps {
  registrations: RegistrationSearchItem[];
  canEditRegistration?: boolean;
  promotedPublications?: string[];
}

export const RegistrationSearchResults = ({
  registrations,
  canEditRegistration = false,
  promotedPublications = [],
  ...rest
}: RegistrationSearchResultsProps) => {
  useEffect(() => {
    if (
      registrations.some(
        ({ mainTitle, abstract }) => stringIncludesMathJax(mainTitle) || stringIncludesMathJax(abstract)
      )
    ) {
      typesetMathJax();
    }
  }, [registrations]);

  return (
    <RegistrationList
      registrations={registrations}
      canEditRegistration={canEditRegistration}
      promotedPublications={promotedPublications}
      {...rest}
    />
  );
};
