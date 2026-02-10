import { Box, Typography } from '@mui/material';
import { CentralImportAffiliationBox } from './CentralImportAffiliationBox';
import { ImportContributor } from '../../../../types/importCandidate.types';
import { OrganizationBox } from '../../../../components/institution/OrganizationBox';
import { UnconfirmedOrganizationBox } from '../../../../components/institution/UnconfirmedOrganizationBox';

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
      <Box sx={{ gridColumn: '2', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography sx={{ gridRow: '1', mt: '0.5rem' }}>{importContributor.identity.name}</Typography>
        {importContributor.affiliations.map((affiliation, index) => {
          if (affiliation.sourceOrganization) {
            return <CentralImportAffiliationBox key={index} affiliation={affiliation} />;
          }

          const target = affiliation.targetOrganization;
          if (!target) {
            return null;
          }

          if (target.type === 'Organization') {
            return <OrganizationBox key={index} unitUri={target.id} sx={{ width: '80%' }} />;
          }

          if (target.type === 'UnconfirmedOrganization') {
            return <UnconfirmedOrganizationBox key={index} name={target.name} sx={{ width: '80%' }} />;
          }

          return null;
        })}
      </Box>
    </>
  );
};
