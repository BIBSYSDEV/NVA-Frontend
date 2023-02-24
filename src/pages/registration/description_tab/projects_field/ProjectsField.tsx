import { Field, FieldProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { Autocomplete, Box, Button, Divider, Typography } from '@mui/material';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { CristinProject, ResearchProject } from '../../../../types/project.types';
import { DescriptionFieldNames } from '../../../../types/publicationFieldNames';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { CristinApiPath } from '../../../../api/apiPaths';
import { ProjectChip } from './ProjectChip';
import { dataTestId } from '../../../../utils/dataTestIds';
import { ProjectFormDialog } from '../../../projects/form/ProjectFormDialog';
import { BetaFunctionality } from '../../../../components/BetaFunctionality';
import { SearchResponse } from '../../../../types/common.types';

export const ProjectsField = () => {
  const { t } = useTranslation();
  const [openNewProjectDialog, setOpenNewProjectDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [projects, isLoadingProjects] = useFetch<SearchResponse<CristinProject>>({
    url: debouncedSearchTerm ? `${CristinApiPath.Project}?query=${encodeURIComponent(debouncedSearchTerm)}` : '',
    errorMessage: t('feedback.error.project_search'),
  });

  return (
    <>
      <Divider />
      <Typography variant="h2">{t('project.project')}</Typography>
      <Box sx={{ display: 'grid', alignItems: 'center', gridTemplateColumns: '4fr 1fr', gap: '0.5rem' }}>
        <Field name={DescriptionFieldNames.Projects}>
          {({ field, form: { setFieldValue } }: FieldProps<ResearchProject[]>) => (
            <>
              <Autocomplete
                id={field.name}
                aria-labelledby={`${field.name}-label`}
                data-testid={dataTestId.registrationWizard.description.projectSearchField}
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
                    name:
                      'title' in projectValue ? projectValue.title : 'name' in projectValue ? projectValue.name : '',
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
                  <li {...props} key={option.id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }} data-testid={`project-option-${option.id}`}>
                      <Typography variant="subtitle1">
                        <EmphasizeSubstring text={option.title} emphasized={state.inputValue} />
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {getLanguageString(option.coordinatingInstitution.name)}
                      </Typography>
                    </Box>
                  </li>
                )}
                renderInput={(params) => (
                  <AutocompleteTextField
                    {...params}
                    label={t('registration.description.project_association')}
                    isLoading={isLoadingProjects}
                    placeholder={t('registration.description.search_for_project')}
                    showSearchIcon={field.value.length === 0}
                  />
                )}
              />
              <BetaFunctionality>
                <Button
                  data-testid={dataTestId.registrationWizard.description.createProjectButton}
                  onClick={() => setOpenNewProjectDialog(true)}
                  startIcon={<AddIcon />}>
                  {t('project.create_project')}
                </Button>
                <ProjectFormDialog
                  open={openNewProjectDialog}
                  onClose={() => setOpenNewProjectDialog(false)}
                  onCreateProject={(project) => {
                    const newProject: ResearchProject = {
                      type: 'ResearchProject',
                      id: project.id,
                      name: project.title,
                    };
                    const newProjects = field.value ? [...field.value, newProject] : [newProject];
                    setFieldValue(field.name, newProjects);
                  }}
                />
              </BetaFunctionality>
            </>
          )}
        </Field>
      </Box>
    </>
  );
};
