import { Box, Typography } from '@mui/material';
import { CentralImportAffiliationBox } from './CentralImportAffiliationBox';
import { ImportContributor } from '../../../../types/importCandidate.types';

interface CentralImportContributorBoxProps {
  importContributor: ImportContributor;
}
export const CentralImportContributorBox = ({ importContributor }: CentralImportContributorBoxProps) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gridColumn: '1',
          bgcolor: 'white',
          height: '2.5rem',
          width: '2.5rem',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {importContributor.sequence}
      </Box>
      <Box sx={{ gridColumn: '2' }}>
        <Typography sx={{ gridRow: '1', mt: '0.5rem' }}>{importContributor.identity.name}</Typography>
        {importContributor.affiliations.map(
          (affiliation, index) =>
            !!affiliation.sourceOrganization && <CentralImportAffiliationBox key={index} affiliation={affiliation} />
        )}
      </Box>
    </>
  );
};
