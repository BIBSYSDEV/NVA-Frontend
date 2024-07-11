import { Autocomplete } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { searchForProjects } from '../../../api/cristinApi';
import { AutocompleteProjectOption } from '../../../components/AutocompleteProjectOption';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { CristinProject, ProjectFieldName } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { ProjectChip } from '../../registration/description_tab/projects_field/ProjectChip';

export const RelatedProjectsField = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const projectsQuery = useQuery({
    enabled: debouncedSearchTerm.length > 0,
    queryKey: ['projects', 10, 1, debouncedSearchTerm],
    queryFn: () => searchForProjects(10, 1, { query: debouncedSearchTerm }),
    meta: { errorMessage: t('feedback.error.project_search') },
  });

  const projects = projectsQuery.data?.hits ?? [];

  return (
    <Field name={ProjectFieldName.RelatedProjects}>
      {({ field, form: { setFieldValue } }: FieldProps<string[]>) => (
        <Autocomplete
          data-testid={dataTestId.registrationWizard.description.projectForm.relatedProjectsSearchField}
          options={projects}
          filterOptions={(options) => options}
          getOptionLabel={(option) => option.title}
          onInputChange={(_, newInputValue, reason) => {
            if (reason !== 'reset') {
              // Autocomplete triggers "reset" events after input change when it's controlled. Ignore these.
              setSearchTerm(newInputValue);
            }
          }}
          inputValue={searchTerm}
          onChange={(_, value: (string | CristinProject)[]) => {
            setSearchTerm('');
            const projectUris = value.map((project) => (typeof project === 'string' ? project : project.id));
            setFieldValue(field.name, projectUris);
          }}
          popupIcon={null}
          clearIcon={null}
          multiple
          value={(field.value ?? []) as any[]}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <ProjectChip
                {...getTagProps({ index })}
                key={index}
                id={option}
                fallbackName={option.split('/').pop() ?? ''}
              />
            ))
          }
          getOptionDisabled={(option) => field.value.some((project) => project === option.id)}
          loading={projectsQuery.isFetching}
          renderOption={({ key, ...props }, option: CristinProject, state) => (
            <AutocompleteProjectOption key={option.id} project={option} inputValue={state.inputValue} props={props} />
          )}
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
  );
};
