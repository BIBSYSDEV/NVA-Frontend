import React, { FC, Fragment } from 'react';
import useFetchUnitHierarchy from '../../utils/hooks/useFetchUnitHierarchy';
import { getUnitHierarchyNames } from '../../utils/institutions-helpers';
import { AffiliationSkeleton } from './AffiliationSkeleton';
import { Typography } from '@material-ui/core';

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
  const [unit, isLoadingUnit] = useFetchUnitHierarchy(unitUri);
  const unitNames = unit ? getUnitHierarchyNames(unit) : [];

  return isLoadingUnit ? (
    <AffiliationSkeleton commaSeparated={commaSeparated} />
  ) : unit ? (
    commaSeparated ? (
      <i>
        <Typography>{unitNames.join(', ')}</Typography>
      </i>
    ) : (
      <div>
        {unitNames.map((unitName, index) => (
          <Fragment key={unitName}>
            {index === 0 && boldTopLevel ? (
              <Typography variant="h6">{unitName}</Typography>
            ) : (
              <Typography>{unitName}</Typography>
            )}
          </Fragment>
        ))}
      </div>
    )
  ) : null;
};

export default AffiliationHierarchy;
