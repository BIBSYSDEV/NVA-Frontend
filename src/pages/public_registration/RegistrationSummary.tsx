import React from 'react';
import { Link } from '@mui/material';
import { Skeleton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useSearchRegistrations } from '../../utils/hooks/useSearchRegistrations';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { SearchFieldName } from '../../types/search.types';

interface RegistrationSummaryProps {
  id: string;
}

export const RegistrationSummary = ({ id }: RegistrationSummaryProps) => {
  const [searchContainer, isLoadingSearchContainer] = useSearchRegistrations({
    properties: [{ fieldName: SearchFieldName.Id, value: id?.split('/').pop() ?? '' }],
  });

  const container = searchContainer && searchContainer.hits.length === 1 ? searchContainer.hits[0] : null;

  // TODO: Reuse <SelectedContainerSummary> to show data about container
  return isLoadingSearchContainer ? (
    <Skeleton width={400} />
  ) : (
    container && (
      <Link component={RouterLink} to={getRegistrationLandingPagePath(container.identifier)}>
        {container.entityDescription.mainTitle}
      </Link>
    )
  );
};
