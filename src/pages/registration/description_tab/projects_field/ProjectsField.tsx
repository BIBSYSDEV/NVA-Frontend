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
import { convertToCristinProject, convertToResearchProject, getProjectTitle } from './projectHelpers';

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
          options={projects}
          getOptionLabel={(option) => getProjectTitle(option)}
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
                data-testid={`project-chip-${option.cristinProjectId}`}
                label={
                  <StyledFlexColumn>
                    <Typography variant="subtitle1">{getProjectTitle(option)}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {option.institutions.map((institution) => institution.name).join(', ')}
                    </Typography>
                  </StyledFlexColumn>
                }
              />
            ))
          }
          getOptionDisabled={(option) => field.value.some((project) => project.id === option.cristinProjectId)}
          loading={isLoadingProjects}
          renderOption={(option, state) => (
            <StyledFlexColumn data-testid={`project-option-${option.cristinProjectId}`}>
              <Typography variant="subtitle1">
                <EmphasizeSubstring text={getProjectTitle(option)} emphasized={state.inputValue} />
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {option.institutions?.map((institution) => institution.name).join(', ')}
              </Typography>
            </StyledFlexColumn>
          )}
          renderInput={(params) => (
            <AutocompleteTextField
              {...params}
              label={t('description.project_association')}
              isLoading={isLoadingProjects}
              placeholder={t('description.search_for_project')}
              dataTestId="project-search-input"
              showSearchIcon={field.value.length === 0}
            />
          )}
        />
      )}
    </Field>
  );
};

export default ProjectsField;
