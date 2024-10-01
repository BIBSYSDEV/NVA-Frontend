import { Autocomplete, Box, Typography } from '@mui/material';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchProjects } from '../../../api/hooks/useFetchProjects';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { ListPagination } from '../../../components/ListPagination';
import { CristinProject, ProjectFieldName, SaveCristinProject } from '../../../types/project.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { RelatedProjectItem } from './RelatedProjectItem';

export const RelatedProjectsField = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<SaveCristinProject>();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const projectsQuery = useFetchProjects(debouncedSearchTerm);
  const projects = projectsQuery.data?.hits ?? [];
  const paginatedProjects = values.relatedProjects.slice(rowsPerPage * (page - 1), rowsPerPage * page);

  const removeProject = (projectId: string) =>
    setFieldValue(
      ProjectFieldName.RelatedProjects,
      values[ProjectFieldName.RelatedProjects].filter((val) => val !== projectId)
    );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="h2">{t('project.form.related_projects')}</Typography>
      <Typography>{t('project.form.related_projects_description')}</Typography>
      <Field name={ProjectFieldName.RelatedProjects}>
        {({ field, form: { setFieldValue } }: FieldProps<string[]>) => (
          <Autocomplete
            data-testid={dataTestId.registrationWizard.description.projectForm.relatedProjectsSearchField}
            options={projects}
            getOptionLabel={(option) => option.title || ''}
            onInputChange={(_, newInputValue, reason) => {
              if (reason !== 'reset') {
                // Autocomplete triggers "reset" events after input change when it's controlled. Ignore these.
                setSearchTerm(newInputValue);
              }
            }}
            inputValue={searchTerm}
            onChange={(_, value: CristinProject | null) => {
              if (value?.id) {
                setSearchTerm('');
                const projectUris = [...values[ProjectFieldName.RelatedProjects], value.id];
                setFieldValue(field.name, projectUris);
              }
            }}
            popupIcon={null}
            clearIcon={null}
            value={null}
            getOptionDisabled={(option) => field.value.some((project) => project === option.id)}
            loading={projectsQuery.isFetching}
            renderInput={(params) => (
              <AutocompleteTextField
                {...params}
                label={t('project.form.related_projects')}
                isLoading={projectsQuery.isFetching}
                placeholder={t('search.search_project_placeholder')}
                showSearchIcon={field.value.length === 0}
              />
            )}
          />
        )}
      </Field>
      {values.relatedProjects.length > 0 && (
        <ListPagination
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          count={values.relatedProjects.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(1);
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: 0 }} component={'ul'}>
            {paginatedProjects.map((relatedProject) => (
              <RelatedProjectItem
                projectId={relatedProject}
                key={relatedProject}
                removeProject={() => removeProject(relatedProject)}
              />
            ))}
          </Box>
        </ListPagination>
      )}
    </Box>
  );
};
