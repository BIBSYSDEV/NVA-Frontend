import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Organization } from '../../types/organization.types';
import { getOrganizationHierarchy } from '../../utils/institutions-helpers';
import { getLanguageString } from '../../utils/translation-helpers';

interface OrganizationHierarchyProps {
  organization: Organization;
}

export const OrganizationHierarchy = ({ organization }: OrganizationHierarchyProps) => {
  const { t } = useTranslation();
  const units = getOrganizationHierarchy(organization);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: '1',
      }}>
      {units.map((unit, index) =>
        index === 0 ? (
          <Box sx={{ display: 'flex', gap: '0.15rem' }} key={unit.id}>
            <Typography component="sup" fontWeight="bold" fontSize={'10px'}>
              {organization.country}
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              {/* TODO: Make this into a hook */}
              {t('use_rerender', { value: getLanguageString(unit.labels) })}
            </Typography>
          </Box>
        ) : (
          <Typography key={unit.id}>| {getLanguageString(unit.labels)}</Typography>
        )
      )}
    </Box>
  );
};
