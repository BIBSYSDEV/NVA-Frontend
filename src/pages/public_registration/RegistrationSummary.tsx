import React from 'react';
import { Link } from '@mui/material';
import { Skeleton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useSearchRegistrations } from '../../utils/hooks/useSearchRegistrations';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { getRegistrationIdentifier } from '../../utils/registration-helpers';
import { RegistrationFieldName } from '../../types/publicationFieldNames';

interface RegistrationSummaryProps {
  id: string;
}

export const RegistrationSummary = ({ id }: RegistrationSummaryProps) => {
  const identifier = getRegistrationIdentifier(id);
  const [searchContainer, isLoadingSearchContainer] = useSearchRegistrations({
    properties: [{ fieldName: RegistrationFieldName.Identifier, value: identifier }],
  });

  const container = searchContainer && searchContainer.hits.length === 1 ? searchContainer.hits[0] : null;

  return isLoadingSearchContainer ? (
    <Skeleton width={400} />
  ) : (
    container && (
      <Link component={RouterLink} to={getRegistrationLandingPagePath(identifier)}>
        {container.entityDescription?.mainTitle}
      </Link>
    )
  );
};
