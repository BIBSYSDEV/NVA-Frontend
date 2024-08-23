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

interface ProjectContributorsProps {
  suggestedProjectManager?: string;
  isVisited: boolean;
  showHeader?: boolean;
}

export const ProjectContributors = ({ suggestedProjectManager, isVisited, showHeader }: ProjectContributorsProps) => {
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openAddContributorView, setOpenAddContributorView] = useState(false);
  const { values, errors } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const contributorsToShow = contributors.slice(rowsPerPage * (currentPage - 1), rowsPerPage * currentPage);
  const contributorError = errors?.contributors;
  const hasProjectManager = values.contributors.some((contributor) =>
    contributor.roles.some((role) => role.type === 'ProjectManager')
  );
  const toggleOpenAddContributorView = () => setOpenAddContributorView(!openAddContributorView);
  const hasUnidentifiedContributor = contributors.some((contributor) => !contributor.identity.id);

  return (
    <>
      {showHeader && (
        <Typography variant="h3" gutterBottom sx={{ marginTop: '2rem', marginBottom: '1rem' }}>
          {t('project.project_participants')}
        </Typography>
      )}
      {suggestedProjectManager && (
        <Typography sx={{ marginBottom: '1rem' }}>
          {t('project.project_manager_from_nfr', { name: suggestedProjectManager })}
        </Typography>
      )}
      <FieldArray name={ProjectFieldName.Contributors}>
        {({ name, remove }: FieldArrayRenderProps) => (
          <>
            <Button
              sx={{ marginBottom: '1rem', borderRadius: '1rem', width: '17rem' }}
              onClick={toggleOpenAddContributorView}
              variant="contained"
              startIcon={<AddIcon />}
              disabled={hasUnidentifiedContributor}
              data-testid={dataTestId.registrationWizard.description.projectForm.addParticipantButton}>
              {t('project.add_project_contributor')}
            </Button>
            {contributors.length > 0 && (
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
                      {contributorsToShow.map((contributor) => {
                        const contributorIndex = contributors.findIndex(
                          (c) => c.identity.id === contributor.identity.id
                        );
                        return (
                          <ContributorRow
                            key={contributor.identity.id}
                            contributorIndex={contributorIndex}
                            baseFieldName={`${name}[${contributorIndex}]`}
                            contributor={contributor}
                            removeContributor={() => remove(contributorIndex)}
                          />
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListPagination>
            )}
            {contributorError && typeof contributorError === 'string' && isVisited && (
              <Typography
                sx={{ color: 'error.main', marginTop: '0.25rem', letterSpacing: '0.03333em', marginBottom: '1rem' }}>
                {contributorError}
              </Typography>
            )}
          </>
        )}
      </FieldArray>
      <AddProjectContributorModal
        open={openAddContributorView}
        toggleModal={toggleOpenAddContributorView}
        hasProjectManager={hasProjectManager}
      />
    </>
  );
};
