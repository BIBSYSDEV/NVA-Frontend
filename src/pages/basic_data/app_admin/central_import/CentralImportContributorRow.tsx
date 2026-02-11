import { Box, TableCell, TableRow } from '@mui/material';
import { useFormikContext } from 'formik';
import { Contributor } from '../../../../types/contributor.types';
import { ImportContributor } from '../../../../types/importCandidate.types';
import { Registration } from '../../../../types/registration.types';
import { CristinPerson } from '../../../../types/user.types';
import {
  replaceExistingContributor,
  replaceExistingContributorAndAffiliations,
} from '../../../../utils/central-import-helpers';
import { CentralImportContributorAccordion } from './CentralImportContributorAccordion';
import { ImportCandidatetContributorBox } from './ImportCandidateContributorBox';

interface CentralImportContributorRowProps {
  contributor: Contributor | undefined;
  importContributor: ImportContributor;
}
export const CentralImportContributorRow = ({ contributor, importContributor }: CentralImportContributorRowProps) => {
  const { values, setFieldValue } = useFormikContext<Registration>();

  return (
    <TableRow>
      <TableCell sx={{ verticalAlign: 'top' }}>
        <Box
          sx={{
            display: 'flex',
            bgcolor: 'white',
            height: '2.5rem',
            width: '2.5rem',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: `1px solid black`,
          }}>
          {importContributor.sequence}
        </Box>
      </TableCell>
      <TableCell sx={{ verticalAlign: 'top' }}>
        <ImportCandidatetContributorBox importContributor={importContributor} />
      </TableCell>
      <TableCell sx={{ verticalAlign: 'top' }}>
        {contributor && (
          <CentralImportContributorAccordion
            contributor={contributor}
            onSelectPersonAndAffiliation={(selected: CristinPerson) =>
              replaceExistingContributorAndAffiliations(values, setFieldValue, selected, contributor.sequence)
            }
            onSelectPerson={(selected: CristinPerson) =>
              replaceExistingContributor(values, setFieldValue, selected, contributor.sequence)
            }
          />
        )}
      </TableCell>
    </TableRow>
  );
};
