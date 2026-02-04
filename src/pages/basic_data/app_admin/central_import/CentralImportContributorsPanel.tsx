import { Box, Typography } from '@mui/material';
import { ImportContributor } from '../../../../types/importCandidate.types';
import { CentralImportAffiliationBox } from './CentralImportAffiliationBox';

interface CentralImportContributorsPanelProps {
  importCandidateContributors?: ImportContributor[];
}

export const CentralImportContributorsPanel = ({
  importCandidateContributors,
}: CentralImportContributorsPanelProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {!!importCandidateContributors &&
        importCandidateContributors.map((importContributor) => (
          <Box
            key={importContributor.sequence}
            sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid black', py: '0.5rem' }}>
            <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem' }}>
              <div>
                <Box sx={{ bgcolor: 'white', p: '1rem' }}>{importContributor.sequence}</Box>
              </div>
              <div>
                <Typography>{importContributor.identity.name}</Typography>
                {importContributor.affiliations.map(
                  (affiliation, index) =>
                    !!affiliation.sourceOrganization && (
                      <CentralImportAffiliationBox key={index} affiliation={affiliation} />
                    )
                )}
              </div>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{importContributor.identity.name}</Typography>
              {importContributor.affiliations.map((affiliation, index) => {
                return (
                  <Box key={index}>
                    <Typography>{affiliation.sourceOrganization?.country.name}</Typography>
                    <Typography>{affiliation.sourceOrganization?.names}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}
    </Box>
  );
};
