import React, { FC } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import useFetchDepartment from '../../utils/hooks/useFetchDepartment';
import { getUnitHierarchyNames } from '../../utils/institutions-helpers';
import { AffiliationSkeleton } from './AffiliationSkeleton';

const StyledTypography = styled(Typography)`
  font-weight: bold;
`;

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
      {unitHierarchyNames.map((unitName, index) =>
        index === 0 && boldTopLevel ? (
          <StyledTypography>{unitName}</StyledTypography>
        ) : (
          <Typography key={unitName}>{unitName}</Typography>
        )
      )}
    </div>
  );
};

export default AffiliationHierarchy;
