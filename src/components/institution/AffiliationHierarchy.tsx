import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { getUnitHierarchyNames } from '../../utils/institutions-helpers';
import { AffiliationSkeleton } from './AffiliationSkeleton';
import { useFetchDepartment } from '../../utils/hooks/useFetchDepartment';

const StyledTypography = styled(Typography)`
  font-weight: bold;
`;

const ErrorTypography = styled(Typography)`
  font-style: italic;
`;

interface AffiliationHierarchyProps {
  unitUri: string;
  commaSeparated?: boolean; // Comma separated or line breaks
  boldTopLevel?: boolean; // Only relevant if commaSeparated=false
}

export const AffiliationHierarchy = ({
  unitUri,
  commaSeparated = false,
  boldTopLevel = true,
}: AffiliationHierarchyProps) => {
  const [department, isLoadingDepartment] = useFetchDepartment(unitUri);
  const unitHierarchyNames = getUnitHierarchyNames(unitUri, department);
  const { t } = useTranslation('feedback');

  return isLoadingDepartment ? (
    <AffiliationSkeleton commaSeparated={commaSeparated} />
  ) : department ? (
    commaSeparated ? (
      <i>
        <Typography>{unitHierarchyNames.join(', ')}</Typography>
      </i>
    ) : (
      <div>
        {unitHierarchyNames.map((unitName, index) =>
          index === 0 && boldTopLevel ? (
            <StyledTypography key={unitName + index}>{unitName}</StyledTypography>
          ) : (
            <Typography key={unitName + index}>{unitName}</Typography>
          )
        )}
      </div>
    )
  ) : (
    <ErrorTypography>
      [{t('error.get_affiliation_name', { unitUri, interpolation: { escapeValue: false } })}]
    </ErrorTypography>
  );
};

export default AffiliationHierarchy;
