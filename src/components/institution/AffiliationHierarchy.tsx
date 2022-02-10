import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { getOrganizationHierarchy } from '../../utils/institutions-helpers';
import { AffiliationSkeleton } from './AffiliationSkeleton';
import { Organization } from '../../types/institution.types';
import { getLanguageString } from '../../utils/translation-helpers';
import { useFetchResource } from '../../utils/hooks/useFetchResource';

interface AffiliationHierarchyProps {
  unitUri: string;
  commaSeparated?: boolean; // Comma separated or line breaks
  boldTopLevel?: boolean; // Only relevant if commaSeparated=false
}

export const AffiliationHierarchy = ({ unitUri, commaSeparated, boldTopLevel = true }: AffiliationHierarchyProps) => {
  const { t } = useTranslation('feedback');
  const [organization, isLoadingOrganization] = useFetchResource<Organization>(unitUri, t('error.get_institution'));
  const unitNames = getOrganizationHierarchy(organization).map((unit) => getLanguageString(unit.name));

  return isLoadingOrganization ? (
    <AffiliationSkeleton commaSeparated={commaSeparated} />
  ) : organization ? (
    commaSeparated ? (
      <i>
        <Typography>{unitNames.join(', ')}</Typography>
      </i>
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
      [{t('error.get_affiliation_name', { unitUri, interpolation: { escapeValue: false } })}]
    </Typography>
  );
};
