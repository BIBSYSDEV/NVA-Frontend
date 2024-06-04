import { Box, Typography } from '@mui/material';
import { Organization } from '../../types/organization.types';
import { getOrganizationHierarchy } from '../../utils/institutions-helpers';
import { getLanguageString } from '../../utils/translation-helpers';

interface OrganizationHierarchyProps {
  organization: Organization;
}

export const OrganizationHierarchy = ({ organization }: OrganizationHierarchyProps) => {
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
            <Typography sx={{ fontWeight: 'bold' }}>{getLanguageString(unit.labels)}</Typography>
          </Box>
        ) : (
          <Typography key={unit.id}>| {getLanguageString(unit.labels)}</Typography>
        )
      )}
    </Box>
  );
};
