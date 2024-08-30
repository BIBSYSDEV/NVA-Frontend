import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListPagination } from '../../../components/ListPagination';
import { alternatingTableRowColor } from '../../../themes/mainTheme';
import { CristinProject, ProjectFieldName } from '../../../types/project.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { AddProjectContributorModal } from '../AddProjectContributorModal';
import { ContributorRow } from './ContributorRow';

export const ProjectContributors = () => {
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openAddContributorView, setOpenAddContributorView] = useState(false);
  const { values, setFieldValue } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const contributorsWithNonProjectManagerRole = contributors.filter((contributor) =>
    contributor.roles.some((role) => role.type !== 'ProjectManager')
  );
  const paginatedContributors = contributorsWithNonProjectManagerRole.slice(
    rowsPerPage * (currentPage - 1),
    rowsPerPage * currentPage
  );

  const toggleOpenAddContributorView = () => setOpenAddContributorView(!openAddContributorView);
  const hasUnidentifiedContributor = contributors.some((contributor) => !contributor.identity.id);

  const removeProjectParticipant = (name: string, remove: (index: number) => any, contributorIndex: number) => {
    const contributor = contributors[contributorIndex];
    const hasProjectManagerRole = contributor.roles.some((role) => role.type === 'ProjectManager');

    // Contributor also has Project manager role: Only delete the others
    if (hasProjectManagerRole) {
      const projectManagerIndex = contributor.roles.findIndex((role) => role.type === 'ProjectManager');
      const projectManagerRole = contributor.roles[projectManagerIndex];

      const newContributors = [...contributors];
      const newContributor = { ...contributors[contributorIndex] };
      newContributor.roles = [projectManagerRole];
      newContributors[contributorIndex] = newContributor;

      setFieldValue(name, newContributors);
    } else {
      // Does not have project manager role: Delete the whole contributor
      remove(contributorIndex);
    }
  };

  console.log('contributors', contributors);

  return (
    <>
      <Typography variant="h2">{t('project.project_participants')}</Typography>
      <FieldArray name={ProjectFieldName.Contributors}>
        {({ name, remove }: FieldArrayRenderProps) => (
          <>
            <Button
              sx={{ borderRadius: '1rem', width: '17rem' }}
              onClick={toggleOpenAddContributorView}
              variant="contained"
              startIcon={<AddIcon />}
              disabled={hasUnidentifiedContributor}
              data-testid={dataTestId.registrationWizard.description.projectForm.addParticipantButton}>
              {t('project.add_project_contributor')}
            </Button>
            {contributorsWithNonProjectManagerRole.length > 0 && (
              <ListPagination
                count={contributors.length}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onPageChange={(newPage) => setCurrentPage(newPage)}
                onRowsPerPageChange={(newRowsPerPage) => {
                  setRowsPerPage(newRowsPerPage);
                  setCurrentPage(1);
                }}
                alternativePaginationText={t('common.number_of_rows_per_page')}>
                <TableContainer sx={{ mb: '0.5rem' }} component={Paper}>
                  <Table size="small" sx={alternatingTableRowColor}>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('common.role')}</TableCell>
                        <TableCell>{t('common.name')}</TableCell>
                        <TableCell>{t('common.affiliation')}</TableCell>
                        <TableCell>{t('common.clear')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedContributors.map((contributor) => {
                        const contributorIndex = contributors.findIndex(
                          (c) => c.identity.id === contributor.identity.id
                        );
                        return (
                          <ContributorRow
                            key={contributor.identity.id}
                            contributorIndex={contributorIndex}
                            baseFieldName={`${name}[${contributorIndex}]`}
                            contributor={contributor}
                            removeContributor={() => removeProjectParticipant(name, remove, contributorIndex)}
                          />
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListPagination>
            )}
          </>
        )}
      </FieldArray>
      <AddProjectContributorModal open={openAddContributorView} toggleModal={toggleOpenAddContributorView} />
    </>
  );
};
