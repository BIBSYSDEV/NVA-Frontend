import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListPagination } from '../../../components/ListPagination';
import { alternatingTableRowColor } from '../../../themes/mainTheme';
import { CristinProject, ProjectFieldName } from '../../../types/project.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { isProjectManager, isRekProject } from '../../registration/description_tab/projects_field/projectHelpers';
import { ContributorRow } from './ContributorRow';

interface ProjectContributorsProps {
  currentProject?: CristinProject;
}

export const ProjectContributors = ({ currentProject }: ProjectContributorsProps) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const thisIsRekProject = isRekProject(currentProject);

  return (
    <>
      <FieldArray name={ProjectFieldName.Contributors}>
        {({ name, push, remove }: FieldArrayRenderProps) => (
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
                  {contributors.map((contributor, index) => {
                    const thisContributor =
                      contributor.identity.id &&
                      currentProject?.contributors[index] &&
                      contributor.identity.id === currentProject.contributors[index].identity.id
                        ? currentProject.contributors[index]
                        : undefined;
                    console.log('thisContributor', thisContributor);
                    console.log('contributor', contributor);
                    return (
                      <ContributorRow
                        key={index}
                        contributorIndex={index}
                        baseFieldName={`${name}[${index}]`}
                        contributor={thisContributor}
                        removeContributor={isProjectManager(contributor) ? undefined : () => remove(index)}
                        isRekProject={thisIsRekProject}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </ListPagination>
        )}
      </FieldArray>
    </>
  );
};
