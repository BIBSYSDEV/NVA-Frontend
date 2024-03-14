import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from '../../api/cristinApi';
import { getOrganizationHierarchy } from '../../utils/institutions-helpers';
import { getLanguageString } from '../../utils/translation-helpers';
import { AffiliationSkeleton } from './AffiliationSkeleton';

interface AffiliationHierarchyProps {
  unitUri: string;
}

export const OrganizationTree = ({ unitUri }: AffiliationHierarchyProps) => {
  const { t } = useTranslation();

  const organizationQuery = useQuery({
    queryKey: [unitUri],
    queryFn: () => fetchOrganization(unitUri),
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
  });
  const organization = organizationQuery.data;

  const unitNames = getOrganizationHierarchy(organizationQuery.data).map((unit) => getLanguageString(unit.labels));

  return organizationQuery.isLoading ? (
    <AffiliationSkeleton />
  ) : organization ? (
    <Box
      sx={{
        border: '1px solid',
        borderRadius: '4px',
        p: '0.5rem',
        mb: '0.5rem',
        boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.30)',
        bgcolor: 'white',
      }}>
      {unitNames.map((unitName, index) =>
        index === 0 ? (
          <Box sx={{ display: 'flex', gap: '0.15rem' }} key={unitName + index}>
            <Typography variant="body2" fontWeight="bold" fontSize={9} sx={{ verticalAlign: 'super' }}>
              {organization.country}
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>{unitName}</Typography>
          </Box>
        ) : (
          <Typography key={unitName + index}>| {unitName}</Typography>
        )
      )}
    </Box>
  ) : (
    <Typography sx={{ fontStyle: 'italic' }}>
      [{t('feedback.error.get_affiliation_name', { unitUri, interpolation: { escapeValue: false } })}]
    </Typography>
  );
};
