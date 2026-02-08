import { Box, Checkbox, Divider, FormControlLabel, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react/jsx-runtime';
import { ImportContributor } from '../../../../types/importCandidate.types';
import { Registration } from '../../../../types/registration.types';
import { pairContributors } from '../../../../utils/central-import-helpers';
import { CentralImportContributorBox } from './CentralImportContributorBox';
import { CentralImportSearchForContributor } from './CentralImportSearchForContributor';

interface CentralImportContributorsPanelProps {
  importCandidateContributors?: ImportContributor[];
}

export const CentralImportContributorsPanel = ({
  importCandidateContributors,
}: CentralImportContributorsPanelProps) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<Registration>();
  const [showOnlyNorwegianContributors, setShowOnlyNorwegianContributors] = useState(false);
  const importContributors = importCandidateContributors ?? [];
  const formContributors = values.entityDescription?.contributors ?? [];

  const visibleImportContributors = showOnlyNorwegianContributors
    ? importContributors.filter((contributor) =>
        contributor.affiliations?.some((aff) => aff.sourceOrganization?.country?.code?.toLowerCase() === 'nor')
      )
    : importContributors;

  const paired = pairContributors(visibleImportContributors, formContributors);

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

        {paired.map(({ importContributor, contributor }) => (
          <Fragment key={importContributor.sequence}>
            <CentralImportContributorBox importContributor={importContributor} />
            {contributor && <CentralImportSearchForContributor contributor={contributor} />}
            <Divider orientation="horizontal" sx={{ gridColumn: '1/-1' }} />
          </Fragment>
        ))}
      </Box>
    </>
  );
};
