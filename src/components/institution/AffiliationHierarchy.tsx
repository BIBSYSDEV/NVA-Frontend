import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@mui/material';
import { AffiliationSkeleton } from './AffiliationSkeleton';
import { useFetch } from '../../utils/hooks/useFetch';
import { getLanguageString } from '../../utils/translation-helpers';
import { getUnitHierarchy } from '../../utils/institutions-helpers';
import { Organization } from '../../types/institution.types';

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
  const { t } = useTranslation('feedback');

  const [department, isLoadingDepartment] = useFetch<Organization>({ url: unitUri });
  const unitNames = getUnitHierarchy(department)
    .map((unit) => getLanguageString(unit.name))
    .reverse();

  return isLoadingDepartment ? (
    <AffiliationSkeleton commaSeparated={commaSeparated} />
  ) : department ? (
    commaSeparated ? (
      <i>
        <Typography>{unitNames.join(', ')}</Typography>
      </i>
    ) : (
      <div>
        {unitNames.map((unitName, index) =>
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
