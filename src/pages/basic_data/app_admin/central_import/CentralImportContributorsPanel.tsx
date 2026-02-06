import { Box, Checkbox, Divider, FormControlLabel, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react/jsx-runtime';
import { ImportContributor } from '../../../../types/importCandidate.types';
import { CentralImportContributorBox } from './CentralImportContributorBox';
import { CentralImportSearchForContributor } from './CentralImportSearchForContributor';
import { useState } from 'react';

interface CentralImportContributorsPanelProps {
  importCandidateContributors?: ImportContributor[];
}

export const CentralImportContributorsPanel = ({
  importCandidateContributors,
}: CentralImportContributorsPanelProps) => {
  const { t } = useTranslation();
  const [showOnlyNorwegianContributors, setShowOnlyNorwegianContributors] = useState(false);
  const contributors = importCandidateContributors ?? [];

  const norwegianContributors = contributors.filter((contributor) =>
    contributor.affiliations?.some((aff) => aff.sourceOrganization?.country?.code?.toLowerCase() === 'nor')
  );

  const contributorsToDisplay = showOnlyNorwegianContributors ? norwegianContributors : contributors;

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={showOnlyNorwegianContributors}
            onChange={() => setShowOnlyNorwegianContributors(!showOnlyNorwegianContributors)}
            color="secondary"
          />
        }
        label={t('show_only_norwegian_contributors')}
      />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', columnGap: '1rem', rowGap: '1rem' }}>
        <Typography sx={{ gridColumn: '1', fontWeight: 'bold' }}>{t('common.order')}</Typography>
        <Typography sx={{ gridColumn: '2', fontWeight: 'bold' }}>
          {t('basic_data.central_import.import_candidate')}
        </Typography>
        <Typography sx={{ gridColumn: '3', fontWeight: 'bold' }}>{t('common.page_title')}</Typography>

        <Divider orientation="horizontal" sx={{ gridColumn: '1/-1' }} />

        {!!contributorsToDisplay &&
          contributorsToDisplay.map((importContributor) => (
            <Fragment key={importContributor.sequence}>
              <CentralImportContributorBox importContributor={importContributor} />
              <CentralImportSearchForContributor importContributor={importContributor} />
              <Divider orientation="horizontal" sx={{ gridColumn: '1/-1' }} />
            </Fragment>
          ))}
      </Box>
    </>
  );
};
