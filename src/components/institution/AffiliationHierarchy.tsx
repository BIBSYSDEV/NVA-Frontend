import React, { FC } from 'react';
import { Typography } from '@material-ui/core';
import { getUnitHierarchyNames } from '../../utils/institutions-helpers';
import { AffiliationSkeleton } from './AffiliationSkeleton';
import useFetchDepartment from '../../utils/hooks/useFetchDepartment';

interface AffiliationHierarchyProps {
  unitUri: string;
  commaSeparated?: boolean; // Comma separated or line breaks
  boldTopLevel?: boolean; // Only relevant if commaSeparated=false
}

export const AffiliationHierarchy: FC<AffiliationHierarchyProps> = ({
  unitUri,
  commaSeparated = false,
  boldTopLevel = true,
}) => {
  const [department, isLoadingDepartment] = useFetchDepartment(unitUri);
  const unitHierarchyNames = getUnitHierarchyNames(unitUri, department);

  return isLoadingDepartment ? (
    <AffiliationSkeleton commaSeparated={commaSeparated} />
  ) : commaSeparated ? (
    <i>
      <Typography>{unitHierarchyNames.join(', ')}</Typography>
    </i>
  ) : (
    <div>
      {unitHierarchyNames.map((unitName, index) => (
        <Typography key={unitName} variant={index === 0 && boldTopLevel ? 'h6' : 'body1'}>
          {unitName}
        </Typography>
      ))}
    </div>
  );
};

export default AffiliationHierarchy;
