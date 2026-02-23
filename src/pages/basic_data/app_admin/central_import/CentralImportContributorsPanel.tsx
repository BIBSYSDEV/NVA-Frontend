import { Box, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Contributor } from '../../../../types/contributor.types';
import { ImportContributor } from '../../../../types/importCandidate.types';
import { Registration } from '../../../../types/registration.types';
import { ImportContributorPair, pairContributors } from '../../../../utils/central-import-helpers';
import { CentralImportContributorRow } from './CentralImportContributorRow';
import { dataTestId } from '../../../../utils/dataTestIds';

interface CentralImportContributorsPanelProps {
  importCandidateContributors?: ImportContributor[];
}

export const CentralImportContributorsPanel = ({
  importCandidateContributors,
}: CentralImportContributorsPanelProps) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<Registration>();
  const nvaContributors = values.entityDescription?.contributors ?? [];
  const importContributors = importCandidateContributors ?? [];
  const [showOnlyNorwegianContributors, setShowOnlyNorwegianContributors] = useState(false);
  const [showOnlyUnconfirmedAffiliations, setShowOnlyUnconfirmedAffiliations] = useState(false);

  const hasUnconfirmedAffiliation = (contributor?: Contributor): boolean =>
    contributor?.affiliations?.some((affiliation) => affiliation.type === 'UnconfirmedOrganization') ?? false;

  const filterContributorsWithUnconfirmedAffiliations = (paired: ImportContributorPair[]): ImportContributorPair[] =>
    paired.filter(({ contributor }) => hasUnconfirmedAffiliation(contributor));

  const contributorsToShow = showOnlyNorwegianContributors
    ? importContributors.filter((contributor) =>
        contributor.affiliations?.some((aff) => aff.sourceOrganization?.country?.code?.toLowerCase() === 'nor')
      )
    : importContributors;

  const paired = pairContributors(contributorsToShow, nvaContributors);

  const filteredPaired = showOnlyUnconfirmedAffiliations
    ? filterContributorsWithUnconfirmedAffiliations(paired)
    : paired;

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: '1rem' }}>
        <FormControlLabel
          control={
            <Checkbox
              data-testid={dataTestId.basicData.centralImport.checkboxNorwegian}
              checked={showOnlyNorwegianContributors}
              onChange={() => setShowOnlyNorwegianContributors(!showOnlyNorwegianContributors)}
            />
          }
          label={t('show_only_norwegian_contributors')}
        />
        <FormControlLabel
          control={
            <Checkbox
              data-testid={dataTestId.basicData.centralImport.checkboxUnverified}
              checked={showOnlyUnconfirmedAffiliations}
              onChange={() => setShowOnlyUnconfirmedAffiliations((prev) => !prev)}
            />
          }
          label={t('show_only_unconfirmed_affiliations')}
        />
      </Box>
      <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '6rem' }}>{t('common.order')}</TableCell>
            <TableCell sx={{ width: 'calc((100% - 6rem) / 2)' }}>
              {t('basic_data.central_import.import_candidate')}
            </TableCell>
            <TableCell sx={{ width: 'calc((100% - 6rem) / 2)' }}>{t('common.page_title')}</TableCell>
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
