import { Box, Typography } from '@mui/material';
import { OrganizationBox, StyledOrganizationBox } from '../../../../components/institution/OrganizationBox';
import { ImportAffiliation } from '../../../../types/importCandidate.types';

interface CentralImportAffiliationBoxProps {
  affiliation: ImportAffiliation;
}
export const CentralImportAffiliationBox = ({ affiliation }: CentralImportAffiliationBoxProps) => {
  return (
    <Box>
      {!!affiliation.sourceOrganization && (
        <StyledOrganizationBox sx={{ width: '80%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: '1',
            }}>
            <Typography component="sup" fontWeight="bold" fontSize={'10px'}>
              {affiliation.sourceOrganization?.country.code.toLocaleUpperCase()}
            </Typography>
            {affiliation.sourceOrganization?.names.map((name, index) => (
              <Typography sx={{ fontWeight: 'bold' }} key={index}>
                {index + 1}: {name}
              </Typography>
            ))}
          </Box>
        </StyledOrganizationBox>
      )}

      {affiliation.targetOrganization &&
        affiliation.targetOrganization.type === 'Organization' &&
        !affiliation.sourceOrganization && (
          <OrganizationBox sx={{ width: '80%' }} unitUri={affiliation.targetOrganization.id} />
        )}
    </Box>
  );
};
