import { Field, FieldProps } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Chip, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import EmphasizeSubstring from '../../../../components/EmphasizeSubstring';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { autocompleteTranslationProps } from '../../../../themes/lightTheme';
import { ResearchProject } from '../../../../types/project.types';
import { DescriptionFieldNames } from '../../../../types/publicationFieldNames';
import useDebounce from '../../../../utils/hooks/useDebounce';
import { useFetchProjects } from '../../../../utils/hooks/useFetchProjects';
import { convertToCristinProject, convertToResearchProject } from './projectHelpers';
import { getLanguageString } from '../../../../utils/translation-helpers';

const StyledProjectChip = styled(Chip)`
  height: auto;
`;

export const ProjectsField = () => {
  const { t } = useTranslation('registration');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [projects, isLoadingProjects] = useFetchProjects(debouncedSearchTerm);

  return (
    <Field name={DescriptionFieldNames.PROJECTS}>
      {({ field, form: { setFieldValue } }: FieldProps<ResearchProject[]>) => (
        <Autocomplete
          {...autocompleteTranslationProps}
          id={field.name}
          aria-labelledby={`${field.name}-label`}
          data-testid="project-search-field"
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
          onChange={(_, value) => {
            setSearchTerm('');
            const projectsToPersist = value.map((projectValue) => convertToResearchProject(projectValue));
            setFieldValue(field.name, projectsToPersist);
          }}
          popupIcon={null}
          multiple
          value={field.value.map((project) => convertToCristinProject(project)) ?? []}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <StyledProjectChip
                {...getTagProps({ index })}
                data-testid={`project-chip-${option.id}`}
                label={<Typography variant="subtitle1">{option.title}</Typography>}
              />
            ))
          }
          getOptionDisabled={(option) => field.value.some((project) => project.id === option.id)}
          loading={isLoadingProjects}
          renderOption={(option, state) => (
            <StyledFlexColumn data-testid={`project-option-${option.id}`}>
              <Typography variant="subtitle1">
                <EmphasizeSubstring text={option.title} emphasized={state.inputValue} />
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {getLanguageString(option.coordinatingInstitution.name)}
              </Typography>
            </StyledFlexColumn>
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
