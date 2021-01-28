import React from 'react';
import { Link } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import useSearchRegistrations from '../../utils/hooks/useSearchRegistrations';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { SearchFieldName } from '../../types/search.types';

interface RegistrationSummaryProps {
  id: string;
}

const RegistrationSummary = ({ id }: RegistrationSummaryProps) => {
  const [searchContainer, isLoadingSearchContainer] = useSearchRegistrations({
    properties: [{ fieldName: SearchFieldName.Id, value: id?.split('/').pop() ?? '' }],
  });

  const container = searchContainer && searchContainer.hits.length === 1 ? searchContainer.hits[0] : null;

  return isLoadingSearchContainer ? (
    <Skeleton width={400} />
  ) : (
    container && <Link href={getRegistrationLandingPagePath(container.id)}>{container.title}</Link>
  );
};

export default RegistrationSummary;
