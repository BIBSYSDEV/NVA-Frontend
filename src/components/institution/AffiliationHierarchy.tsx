import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { fetchOrganization } from '../../api/cristinApi';
import { setNotification } from '../../redux/notificationSlice';
import { getOrganizationHierarchy } from '../../utils/institutions-helpers';
import { getLanguageString } from '../../utils/translation-helpers';
import { AffiliationSkeleton } from './AffiliationSkeleton';

interface AffiliationHierarchyProps {
  unitUri: string;
  commaSeparated?: boolean; // Comma separated or line breaks
  boldTopLevel?: boolean; // Only relevant if commaSeparated=false
}

export const AffiliationHierarchy = ({ unitUri, commaSeparated, boldTopLevel = true }: AffiliationHierarchyProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const organizationQuery = useQuery({
    queryKey: [unitUri],
    queryFn: () => fetchOrganization(unitUri),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_institution'), variant: 'error' })),
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
  });
  const organization = organizationQuery.data;

  const unitNames = getOrganizationHierarchy(organizationQuery.data).map((unit) => getLanguageString(unit.labels));

  return organizationQuery.isLoading ? (
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
      [{t('feedback.error.get_affiliation_name', { unitUri, interpolation: { escapeValue: false } })}]
    </Typography>
  );
};
