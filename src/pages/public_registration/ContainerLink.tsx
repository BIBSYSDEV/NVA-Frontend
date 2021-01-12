import React from 'react';
import { Link } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import LabelContentRow from '../../components/LabelContentRow';
import { RegistrationFieldName } from '../../types/publicationFieldNames';
import useSearchRegistrations from '../../utils/hooks/useSearchRegistrations';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';

interface ContainerLinkProps {
  containerId: string;
  label: string;
}

const ContainerLink = (props: ContainerLinkProps) => {
  const [searchContainer, isLoadingSearchContainer] = useSearchRegistrations({
    properties: [{ fieldName: RegistrationFieldName.IDENTIFIER, value: props.containerId?.split('/').pop() ?? '' }],
  });

  const container = searchContainer && searchContainer.hits.length === 1 ? searchContainer.hits[0] : null;

  return (
    <LabelContentRow minimal label={`${props.label}:`}>
      {isLoadingSearchContainer ? (
        <Skeleton width={400} />
      ) : (
        container && <Link href={getRegistrationLandingPagePath(container.id)}>{container.title}</Link>
      )}
    </LabelContentRow>
  );
};

export default ContainerLink;
