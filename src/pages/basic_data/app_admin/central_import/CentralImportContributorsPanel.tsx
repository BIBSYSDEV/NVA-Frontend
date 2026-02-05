import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react/jsx-runtime';
import { ImportContributor } from '../../../../types/importCandidate.types';
import { CentralImportContributorBox } from './CentralImportContributorBox';
import { CentralImportSearchForContributor } from './CentralImportSearchForContributor';

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
            <CentralImportContributorBox importContributor={importContributor} />

            <CentralImportSearchForContributor importContributor={importContributor} />
            <Divider orientation="horizontal" sx={{ gridColumn: '1/-1' }} />
          </Fragment>
        ))}
    </Box>
  );
};
