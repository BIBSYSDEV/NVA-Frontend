import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import { Button, Typography } from '@mui/material';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListPagination } from '../../../components/ListPagination';
import { CristinProject, ProjectContributorType, ProjectFieldName } from '../../../types/project.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import {
  contributorsAreEqual,
  getContributorsWithRelevantRole,
  removeProjectParticipant,
} from '../../project/helpers/projectContributorHelpers';
import { AddProjectContributorModal } from '../AddProjectContributorModal';
import { ContributorRow } from './ContributorRow';
import { ProjectContributorTable } from './ProjectContributorTable';

interface ProjectParticipantProps {
  roleType: ProjectContributorType;
}

export const ProjectParticipants = ({ roleType }: ProjectParticipantProps) => {
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openAddProjectParticipantView, setOpenAddProjectParticipantView] = useState(false);
  const { values, setFieldValue } = useFormikContext<CristinProject>();
  const contributorsWithRole = getContributorsWithRelevantRole(values.contributors, roleType);
  const paginatedContributors = contributorsWithRole.slice(rowsPerPage * (currentPage - 1), rowsPerPage * currentPage);

  const toggleOpenAddProjectParticipantView = () => setOpenAddProjectParticipantView(!openAddProjectParticipantView);

  return (
    <>
      <Typography variant="h2">
        {roleType === 'LocalProjectManager' ? t('project.local_managers') : t('project.project_participants')}
      </Typography>
      <FieldArray name={ProjectFieldName.Contributors}>
        {({ name }: FieldArrayRenderProps) => (
          <>
            <Button
              sx={{ borderRadius: '1rem', width: 'fit-content' }}
              onClick={toggleOpenAddProjectParticipantView}
              variant="contained"
              startIcon={<AddIcon />}
              data-testid={
                roleType === 'LocalProjectManager'
                  ? dataTestId.projectForm.addLocalManagerButton
                  : dataTestId.projectForm.addParticipantButton
              }>
              {roleType === 'LocalProjectManager'
                ? t('project.add_local_manager')
                : t('project.add_project_contributor')}
            </Button>
            {contributorsWithRole.length > 0 && (
              <ListPagination
                count={contributorsWithRole.length}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onPageChange={(newPage) => setCurrentPage(newPage)}
                onRowsPerPageChange={(newRowsPerPage) => {
                  setRowsPerPage(newRowsPerPage);
                  setCurrentPage(1);
                }}
                alternativePaginationText={t('common.number_of_rows_per_page')}>
                <ProjectContributorTable>
                  {paginatedContributors.map((contributor, index) => {
                    const contributorIndex = values.contributors.findIndex((c) => contributorsAreEqual(contributor, c));
                    return (
                      <ContributorRow
                        key={
                          contributor.identity.id
                            ? contributor.identity.id
                            : `${contributor.identity.firstName}_${contributor.identity.lastName}_${index}`
                        }
                        contributorIndex={contributorIndex}
                        baseFieldName={`${name}[${contributorIndex}]`}
                        contributor={contributor}
                        removeContributor={() =>
                          setFieldValue(name, removeProjectParticipant(values.contributors, contributorIndex))
                        }
                        roleType={roleType}
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
        roleType={roleType}
      />
    </>
  );
};
