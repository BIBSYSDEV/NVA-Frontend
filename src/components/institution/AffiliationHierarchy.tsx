import React, { FC } from 'react';
import { convertToInstitution, getUnitHierarchyNames } from '../../utils/institutions-helpers';
import { AffiliationSkeleton } from './AffiliationSkeleton';
import { Typography } from '@material-ui/core';
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

  if (department) {
    if (unitUri === convertToInstitution(department.id)) {
      delete department.subunits;
    } else if (department.subunits && department.subunits.length > 1) {
      delete department.subunits;
    }
  }

  const unitNames = department ? getUnitHierarchyNames(department) : [];

  return isLoadingDepartment ? (
    <AffiliationSkeleton commaSeparated={commaSeparated} />
  ) : department ? (
    commaSeparated ? (
      <i>
        <Typography>{unitNames.join(', ')}</Typography>
      </i>
    ) : (
      <div>
        {unitNames.map((unitName, index) => (
          <Typography key={unitName} variant={index === 0 && boldTopLevel ? 'h6' : 'body1'}>
            {unitName}
          </Typography>
        ))}
      </div>
    )
  ) : null;
};

export default AffiliationHierarchy;
