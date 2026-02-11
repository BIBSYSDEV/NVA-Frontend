import { Box, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Contributor } from '../../../../types/contributor.types';
import { ImportContributor } from '../../../../types/importCandidate.types';
import { Registration } from '../../../../types/registration.types';
import { ImportContributorPair, pairContributors } from '../../../../utils/central-import-helpers';
import { CentralImportContributorRow } from './CentralImportContributorRow';

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

  const hasUnconfirmedAffiliation = (contributor?: Contributor): boolean =>
    contributor?.affiliations?.some((affiliation) => affiliation.type === 'UnconfirmedOrganization') ?? false;

  const filterContributorsWithUnconfirmedAffiliations = (paired: ImportContributorPair[]): ImportContributorPair[] =>
    paired.filter(({ contributor }) => hasUnconfirmedAffiliation(contributor));

  const visibleImportContributors = showOnlyNorwegianContributors
    ? importContributors.filter((contributor) =>
        contributor.affiliations?.some((aff) => aff.sourceOrganization?.country?.code?.toLowerCase() === 'nor')
      )
    : importContributors;

  const paired = pairContributors(visibleImportContributors, formContributors);

  const [showOnlyUnconfirmedAffiliations, setShowOnlyUnconfirmedAffiliations] = useState(false);

  const filteredPaired = showOnlyUnconfirmedAffiliations
    ? filterContributorsWithUnconfirmedAffiliations(paired)
    : paired;

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: '1rem' }}>
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
        <FormControlLabel
          control={
            <Checkbox
              checked={showOnlyUnconfirmedAffiliations}
              onChange={() => setShowOnlyUnconfirmedAffiliations((prev) => !prev)}
              color="secondary"
            />
          }
          label={t('show_only_unconfirmed_affiliations')}
        />
      </Box>
      <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '6rem' }}>{t('common.order')}</TableCell>
            <TableCell sx={{ width: 'calc((100% - 3rem) / 2)' }}>
              {t('basic_data.central_import.import_candidate')}
            </TableCell>
            <TableCell sx={{ width: 'calc((100% - 3rem) / 2)' }}>{t('common.page_title')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPaired.map(({ importContributor, contributor }) => {
            return (
              <CentralImportContributorRow
                key={importContributor.sequence}
                contributor={contributor}
                importContributor={importContributor}
              />
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
