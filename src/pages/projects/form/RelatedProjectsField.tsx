import { Autocomplete } from '@mui/material';
import { useState } from 'react';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { CristinApiPath } from '../../../api/apiPaths';
import { ProjectChip } from '../../registration/description_tab/projects_field/ProjectChip';
import { SearchResponse } from '../../../types/common.types';
import { CristinProject } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { useFetch } from '../../../utils/hooks/useFetch';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { ProjectFieldName } from './ProjectFormDialog';
import { AutocompleteProjectOption } from '../../../components/AutocompleteProjectOption';

export const RelatedProjectsField = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [projects, isLoadingProjects] = useFetch<SearchResponse<CristinProject>>({
    url: debouncedSearchTerm ? `${CristinApiPath.Project}?query=${encodeURIComponent(debouncedSearchTerm)}` : '',
    errorMessage: t('feedback.error.project_search'),
  });

  return (
    <Field name={ProjectFieldName.RelatedProjects}>
      {({ field, form: { setFieldValue } }: FieldProps<string[]>) => (
        <Autocomplete
          data-testid={dataTestId.registrationWizard.description.projectForm.relatedProjectsSearchField}
          options={projects?.hits ?? []}
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
                key={option}
                id={option}
                fallbackName={option.split('/').pop() ?? ''}
              />
            ))
          }
          getOptionDisabled={(option) => field.value.some((project) => project === option.id)}
          loading={isLoadingProjects}
          renderOption={(props, option: CristinProject, state) => (
            <AutocompleteProjectOption project={option} inputValue={state.inputValue} {...props} />
          )}
          renderInput={(params) => (
            <AutocompleteTextField
              {...params}
              label={t('project.form.related_projects')}
              isLoading={isLoadingProjects}
              placeholder={t('registration.description.search_for_project')}
              showSearchIcon={field.value.length === 0}
            />
          )}
        />
      )}
    </Field>
  );
};
