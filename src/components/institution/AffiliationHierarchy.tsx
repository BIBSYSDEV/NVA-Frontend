import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { getOrganizationHierarchy } from '../../utils/institutions-helpers';
import { getLanguageString } from '../../utils/translation-helpers';
import { AffiliationSkeleton } from './AffiliationSkeleton';

interface AffiliationHierarchyProps {
  unitUri: string;
  commaSeparated?: boolean; // Comma separated or line breaks
  condensed?: boolean; // Display only top and bottom level
  boldTopLevel?: boolean; // Only relevant if commaSeparated=false and condensed=false
}

export const AffiliationHierarchy = ({
  unitUri,
  commaSeparated,
  condensed,
  boldTopLevel = true,
}: AffiliationHierarchyProps) => {
  const { t } = useTranslation();
  const organizationQuery = useFetchOrganization(unitUri);
  const organization = organizationQuery.data;
  const unitNames = getOrganizationHierarchy(organizationQuery.data).map((unit) => getLanguageString(unit.labels));

  return organizationQuery.isPending ? (
    <AffiliationSkeleton commaSeparated={commaSeparated} />
  ) : organization ? (
    commaSeparated ? (
      <i>
        <Typography>{unitNames.join(', ')}</Typography>
      </i>
    ) : condensed ? (
      <Typography>{`${unitNames[unitNames.length - 1]} ${unitNames.length > 1 ? `${t('common.at').toLowerCase()} ${unitNames[0]}` : ''}`}</Typography>
    ) : (
      <div>
        {unitNames.map((unitName, index) =>
          index === 0 && boldTopLevel ? (
            <Typography sx={{ fontWeight: 'bold' }} key={unitName + index}>
              {unitName}
            </Typography>
          ) : (
            <Typography key={unitName + index}>{unitName}</Typography>
          )
        )}
      </div>
    )
  ) : (
    <Typography sx={{ fontStyle: 'italic' }}>
      [{t('feedback.error.get_affiliation_name', { unitUri, interpolation: { escapeValue: false } })}]
    </Typography>
  );
};
