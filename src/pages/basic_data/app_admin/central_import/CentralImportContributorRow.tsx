import { Box, Divider, TableCell, TableRow } from '@mui/material';
import { useFormikContext } from 'formik';
import { Contributor } from '../../../../types/contributor.types';
import { ImportContributor } from '../../../../types/importCandidate.types';
import { Registration } from '../../../../types/registration.types';
import { CristinPerson } from '../../../../types/user.types';
import { replaceExistingContributor } from '../../../../utils/central-import-helpers';
import { CentralImportContributorBox } from './CentralImportContributorBox';
import { CentralImportSearchForContributor } from './CentralImportSearchForContributor';

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
        <CentralImportContributorBox importContributor={importContributor} />
      </TableCell>
      <TableCell sx={{ verticalAlign: 'top' }}>
        {contributor && (
          <CentralImportSearchForContributor
            contributor={contributor}
            onSelectPerson={(selected: CristinPerson) =>
              replaceExistingContributor(values, setFieldValue, selected, contributor.sequence)
            }
          />
        )}
      </TableCell>
      <Divider orientation="horizontal" />
    </TableRow>
  );
};
