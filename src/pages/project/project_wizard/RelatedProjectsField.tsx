import { Autocomplete, Box } from '@mui/material';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchProjects } from '../../../api/hooks/useFetchProjects';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { CristinProject, ProjectFieldName, SaveCristinProject } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { RelatedProjectItem } from './RelatedProjectItem';

export const RelatedProjectsField = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<SaveCristinProject>();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const projectsQuery = useFetchProjects(debouncedSearchTerm);
  const projects = projectsQuery.data?.hits ?? [];

  const removeProject = (projectId: string) =>
    setFieldValue(
      ProjectFieldName.RelatedProjects,
      values[ProjectFieldName.RelatedProjects].filter((val) => val !== projectId)
    );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: 0 }} component={'ul'}>
        {values.relatedProjects.map((relatedProject) => (
          <RelatedProjectItem
            projectId={relatedProject}
            key={relatedProject}
            removeProject={() => removeProject(relatedProject)}
          />
        ))}
      </Box>
    </Box>
  );
};
