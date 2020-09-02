import React, { FC, Fragment } from 'react';

import Label from '../Label';
import NormalText from '../NormalText';
import useFetchUnitHierarchy from '../../utils/hooks/useFetchUnitHierarchy';
import { getUnitHierarchyNames } from '../../utils/institutions-helpers';
import { AffiliationSkeleton } from './AffiliationSkeleton';

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
        <NormalText>{unitNames.join(', ')}</NormalText>
      </i>
    ) : (
      <div>
        {unitNames.map((unitName, index) => (
          <Fragment key={unitName}>
            {index === 0 && boldTopLevel ? <Label>{unitName}</Label> : <NormalText>{unitName}</NormalText>}
          </Fragment>
        ))}
      </div>
    )
  ) : null;
};

export default AffiliationHierarchy;
