import { Field, FieldProps } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { autocompleteTranslationProps } from '../../../../themes/lightTheme';
import { CristinProject, ProjectSearchResponse, ResearchProject } from '../../../../types/project.types';
import { DescriptionFieldNames } from '../../../../types/publicationFieldNames';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { convertToCristinProject } from './projectHelpers';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { ProjectsApiPath } from '../../../../api/apiPaths';
import { useFetchResource } from '../../../../utils/hooks/useFetchResource';

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
          {...autocompleteTranslationProps}
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
          onChange={(_, value) => {
            setSearchTerm('');
            const projectsToPersist = value.map((projectValue) => ({
              type: 'ResearchProject',
              id: projectValue.id,
              name: projectValue.title,
            }));
            setFieldValue(field.name, projectsToPersist);
          }}
          popupIcon={null}
          multiple
          value={field.value.map((project) => convertToCristinProject(project)) ?? []}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <ProjectChip {...getTagProps({ index })} id={option.id} fallbackName={option.title} />
            ))
          }
          getOptionDisabled={(option) => field.value.some((project) => project.id === option.id)}
          loading={isLoadingProjects}
          renderOption={(props, option, state) => (
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

interface ProjectChipProps {
  id: string;
  fallbackName: string;
}

const ProjectChip = ({ id, fallbackName, ...rest }: ProjectChipProps) => {
  const [project] = useFetchResource<CristinProject>(id);

  return (
    <Chip
      {...rest}
      sx={{ height: 'auto', py: '0.25rem' }}
      data-testid={`project-chip-${id}`}
      label={
        <>
          <Typography variant="subtitle1">{project?.title ?? fallbackName}</Typography>
          {project && (
            <Typography variant="body2" color="textSecondary">
              {getLanguageString(project.coordinatingInstitution.name)}
            </Typography>
          )}
        </>
      }
    />
  );
};
