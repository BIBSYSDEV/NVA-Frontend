import { Field, FieldProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { CristinProject, ProjectSearchResponse, ResearchProject } from '../../../../types/project.types';
import { DescriptionFieldNames } from '../../../../types/publicationFieldNames';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { ProjectsApiPath } from '../../../../api/apiPaths';
import { ProjectChip } from './ProjectChip';

export const ProjectsField = () => {
  const { t } = useTranslation('registration');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [projects, isLoadingProjects] = useFetch<ProjectSearchResponse>({
    url: debouncedSearchTerm ? `${ProjectsApiPath.Project}?query=${encodeURIComponent(debouncedSearchTerm)}` : '',
    errorMessage: t('feedback:error.get_project'),
  });

  return (
    <Field name={DescriptionFieldNames.Projects}>
      {({ field, form: { setFieldValue } }: FieldProps<ResearchProject[]>) => (
        <Autocomplete
          id={field.name}
          aria-labelledby={`${field.name}-label`}
          data-testid="project-search-field"
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
          onChange={(_, value: (CristinProject | ResearchProject)[]) => {
            setSearchTerm('');
            const projectsToPersist: ResearchProject[] = value.map((projectValue) => ({
              type: 'ResearchProject',
              id: projectValue.id,
              name: 'title' in projectValue ? projectValue.title : 'name' in projectValue ? projectValue.name : '',
            }));
            setFieldValue(field.name, projectsToPersist);
          }}
          popupIcon={null}
          multiple
          value={(field.value ?? []) as any[]}
          renderTags={(value: ResearchProject[], getTagProps) =>
            value.map((option, index) => (
              <ProjectChip {...getTagProps({ index })} key={index} id={option.id} fallbackName={option.name} />
            ))
          }
          getOptionDisabled={(option) => field.value.some((project) => project.id === option.id)}
          loading={isLoadingProjects}
          renderOption={(props, option: CristinProject, state) => (
            <li {...props}>
              <StyledFlexColumn data-testid={`project-option-${option.id}`}>
                <Typography variant="subtitle1">
                  <EmphasizeSubstring text={option.title} emphasized={state.inputValue} />
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {getLanguageString(option.coordinatingInstitution.name)}
                </Typography>
              </StyledFlexColumn>
            </li>
          )}
          renderInput={(params) => (
            <AutocompleteTextField
              {...params}
              label={t('description.project_association')}
              isLoading={isLoadingProjects}
              placeholder={t('description.search_for_project')}
              showSearchIcon={field.value.length === 0}
            />
          )}
        />
      )}
    </Field>
  );
};
