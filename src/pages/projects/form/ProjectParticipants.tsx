import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import { Button, Typography } from '@mui/material';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListPagination } from '../../../components/ListPagination';
import { CristinProject, ProjectFieldName } from '../../../types/project.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import {
  findNonProjectManagerContributors,
  hasUnidentifiedContributor,
} from '../../project/helpers/projectContributorHelpers';
import { findProjectManagerRole, replaceRolesOnContributor } from '../../project/helpers/projectRoleHelpers';
import { AddProjectContributorModal } from '../AddProjectContributorModal';
import { ContributorRow } from './ContributorRow';
import { ProjectContributorTable } from './ProjectContributorTable';

export const ProjectParticipants = () => {
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openAddProjectParticipantView, setOpenAddProjectParticipantView] = useState(false);
  const { values, setFieldValue } = useFormikContext<CristinProject>();
  const contributorsWithNonProjectManagerRole = findNonProjectManagerContributors(values.contributors);
  const paginatedContributors = contributorsWithNonProjectManagerRole.slice(
    rowsPerPage * (currentPage - 1),
    rowsPerPage * currentPage
  );

  const toggleOpenAddProjectParticipantView = () => setOpenAddProjectParticipantView(!openAddProjectParticipantView);

  const removeProjectParticipant = (name: string, remove: (index: number) => any, contributorIndex: number) => {
    const projectManagerRole = findProjectManagerRole(values.contributors[contributorIndex]);

    // Contributor also has Project manager role: Only delete all the others
    if (projectManagerRole) {
      const newContributors = replaceRolesOnContributor(values.contributors, contributorIndex, [projectManagerRole]);
      setFieldValue(name, newContributors);
    } else {
      // Does not have project manager role: Delete the whole contributor
      remove(contributorIndex);
    }
  };

  return (
    <>
      <Typography variant="h2">{t('project.project_participants')}</Typography>
      <FieldArray name={ProjectFieldName.Contributors}>
        {({ name, remove }: FieldArrayRenderProps) => (
          <>
            <Button
              sx={{ borderRadius: '1rem', width: '17rem' }}
              onClick={toggleOpenAddProjectParticipantView}
              variant="contained"
              startIcon={<AddIcon />}
              disabled={hasUnidentifiedContributor(contributorsWithNonProjectManagerRole)}
              data-testid={dataTestId.projectForm.addParticipantButton}>
              {t('project.add_project_contributor')}
            </Button>
            {contributorsWithNonProjectManagerRole.length > 0 && (
              <ListPagination
                count={contributorsWithNonProjectManagerRole.length}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onPageChange={(newPage) => setCurrentPage(newPage)}
                onRowsPerPageChange={(newRowsPerPage) => {
                  setRowsPerPage(newRowsPerPage);
                  setCurrentPage(1);
                }}
                alternativePaginationText={t('common.number_of_rows_per_page')}>
                <ProjectContributorTable>
                  {paginatedContributors.map((contributor) => {
                    const contributorIndex = values.contributors.findIndex(
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
                </ProjectContributorTable>
              </ListPagination>
            )}
          </>
        )}
      </FieldArray>
      <AddProjectContributorModal
        open={openAddProjectParticipantView}
        toggleModal={toggleOpenAddProjectParticipantView}
      />
    </>
  );
};
