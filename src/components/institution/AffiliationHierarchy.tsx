import React, { FC, Fragment } from 'react';
import { CircularProgress } from '@material-ui/core';

import Label from '../Label';
import NormalText from '../NormalText';
import useFetchUnitHierarchy from '../../utils/hooks/useFetchUnitHierarchy';
import { getUnitHierarchyStrings } from '../../utils/institutions-helpers';

interface AffiliationHierarchyProps {
  unitUri: string;
  commaSeparated?: boolean; // Comma separated or line breaks
  boldTopLevel?: boolean; // Only relevant if commaSeparated=true
}

export const AffiliationHierarchy: FC<AffiliationHierarchyProps> = ({
  unitUri,
  commaSeparated = false,
  boldTopLevel = true,
}) => {
  const [unit, isLoadingUnit] = useFetchUnitHierarchy(unitUri);
  const unitNames = unit ? getUnitHierarchyStrings(unit) : [];

  return isLoadingUnit ? (
    <CircularProgress size={20} />
  ) : unit ? (
    commaSeparated ? (
      <NormalText>{unitNames.join(', ')}</NormalText>
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
