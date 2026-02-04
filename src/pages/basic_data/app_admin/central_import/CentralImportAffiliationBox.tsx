import { Box, Typography } from '@mui/material';
import { ImportAffiliation } from '../../../../types/importCandidate.types';
import { StyledOrganizationBox } from '../../../../components/institution/OrganizationBox';

interface CentralImportAffiliationBoxProps {
  affiliation: ImportAffiliation;
}
export const CentralImportAffiliationBox = ({ affiliation }: CentralImportAffiliationBoxProps) => {
  return (
    <StyledOrganizationBox sx={{ width: '80%', mt: '1rem' }}>
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
  );
};
