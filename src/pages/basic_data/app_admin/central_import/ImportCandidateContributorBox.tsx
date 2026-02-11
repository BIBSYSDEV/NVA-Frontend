import { Box, Typography } from '@mui/material';
import { CentralImportAffiliationBox } from './CentralImportAffiliationBox';
import { ImportContributor } from '../../../../types/importCandidate.types';
import { OrganizationBox } from '../../../../components/institution/OrganizationBox';
import { UnconfirmedOrganizationBox } from '../../../../components/institution/UnconfirmedOrganizationBox';

interface ImportCandidatetContributorBoxProps {
  importContributor: ImportContributor;
}
export const ImportCandidatetContributorBox = ({ importContributor }: ImportCandidatetContributorBoxProps) => {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography sx={{ mt: '0.5rem' }}>{importContributor.identity.name}</Typography>
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
