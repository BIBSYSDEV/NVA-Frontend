import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react/jsx-runtime';
import { ImportContributor } from '../../../../types/importCandidate.types';
import { CentralImportAffiliationBox } from './CentralImportAffiliationBox';

interface CentralImportContributorsPanelProps {
  importCandidateContributors?: ImportContributor[];
}

export const CentralImportContributorsPanel = ({
  importCandidateContributors,
}: CentralImportContributorsPanelProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', columnGap: '1rem', rowGap: '1rem' }}>
      <Typography sx={{ gridColumn: '1', fontWeight: 'bold' }}>{t('common.order')}</Typography>
      <Typography sx={{ gridColumn: '2', fontWeight: 'bold' }}>
        {t('basic_data.central_import.import_candidate')}
      </Typography>
      <Typography sx={{ gridColumn: '3', fontWeight: 'bold' }}>{t('common.page_title')}</Typography>

      <Divider orientation="horizontal" sx={{ gridColumn: '1/-1' }} />

      {!!importCandidateContributors &&
        importCandidateContributors.map((importContributor) => (
          <Fragment key={importContributor.sequence}>
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
                  !!affiliation.sourceOrganization && (
                    <CentralImportAffiliationBox key={index} affiliation={affiliation} />
                  )
              )}
            </Box>
            <Box sx={{ gridColumn: '3' }}>
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
            <Divider orientation="horizontal" sx={{ gridColumn: '1/-1' }} />
          </Fragment>
        ))}
    </Box>
  );
};
