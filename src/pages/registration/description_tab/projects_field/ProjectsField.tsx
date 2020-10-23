import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Field, FieldProps } from 'formik';
import { Typography, Chip } from '@material-ui/core';
import styled from 'styled-components';
import { getProjectTitle, convertToResearchProject, convertToCristinProject } from './helpers';
import useFetchProjects from '../../../../utils/hooks/useFetchProjects';
import { DescriptionFieldNames } from '../../../../types/publicationFieldNames';
import { ResearchProject } from '../../../../types/project.types';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import EmphasizeSubstring from '../../../../components/EmphasizeSubstring';
import { autocompleteTranslationProps } from '../../../../themes/mainTheme';

const StyledProjectChip = styled(Chip)`
  height: auto;
`;

export const ProjectsField: FC = () => {
  const { t } = useTranslation('registration');
  const [projects, isLoadingProjects, handleNewSearchTerm] = useFetchProjects();

  return (
    <Field name={DescriptionFieldNames.PROJECT}>
      {({ field, form: { setFieldValue } }: FieldProps<ResearchProject>) => (
        <Autocomplete
          {...autocompleteTranslationProps}
          options={projects}
          getOptionLabel={(option) => getProjectTitle(option)}
          onInputChange={(_, newInputValue) => {
            handleNewSearchTerm(newInputValue);
          }}
          onChange={(_, value) => {
            const projectToPersist = value[0] ? convertToResearchProject(value[0]) : undefined;
            setFieldValue(field.name, projectToPersist);
          }}
          multiple
          defaultValue={field.value ? [field.value].map((project) => convertToCristinProject(project)) : []}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <StyledProjectChip
                {...getTagProps({ index })}
                data-testid="project-chip"
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
          getOptionDisabled={(option) => field.value?.id === option.cristinProjectId}
          loading={isLoadingProjects}
          renderOption={(option, state) => (
            <StyledFlexColumn>
              <Typography variant="subtitle1">
                <EmphasizeSubstring text={getProjectTitle(option)} emphasized={state.inputValue} />
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {option.institutions.map((institution) => institution.name).join(', ')}
              </Typography>
            </StyledFlexColumn>
          )}
          renderInput={(params) => (
            <AutocompleteTextField
              {...params}
              isLoading={isLoadingProjects}
              placeholder={t('description.search_for_project')}
              dataTestId="project-search-input"
              showSearchIcon={!field.value}
            />
          )}
        />
      )}
    </Field>
  );
};

export default ProjectsField;
