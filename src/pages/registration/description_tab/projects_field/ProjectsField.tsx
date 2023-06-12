import { Field, FieldProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import AddIcon from '@mui/icons-material/Add';
import { Autocomplete, Box, Button, Divider, Typography } from '@mui/material';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { CristinProject, ResearchProject } from '../../../../types/project.types';
import { DescriptionFieldNames } from '../../../../types/publicationFieldNames';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { ProjectChip } from './ProjectChip';
import { dataTestId } from '../../../../utils/dataTestIds';
import { ProjectFormDialog } from '../../../projects/form/ProjectFormDialog';
import { AutocompleteProjectOption } from '../../../../components/AutocompleteProjectOption';
import { searchForProjects } from '../../../../api/cristinApi';

export const ProjectsField = () => {
  const { t } = useTranslation();
  const [openNewProjectDialog, setOpenNewProjectDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const projectsQuery = useQuery({
    enabled: debouncedSearchTerm.length > 0,
    queryKey: ['projects', debouncedSearchTerm],
    queryFn: () => searchForProjects(10, 1, { query: debouncedSearchTerm }),
    meta: { errorMessage: t('feedback.error.project_search') },
  });

  const projects = projectsQuery.data?.hits ?? [];

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
                loading={projectsQuery.isFetching}
                renderOption={(props, option: CristinProject, state) => (
                  <AutocompleteProjectOption project={option} inputValue={state.inputValue} {...props} />
                )}
                renderInput={(params) => (
                  <AutocompleteTextField
                    {...params}
                    label={t('registration.description.project_association')}
                    isLoading={projectsQuery.isFetching}
                    placeholder={t('registration.description.search_for_project')}
                    showSearchIcon={field.value.length === 0}
                  />
                )}
              />
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
            </>
          )}
        </Field>
      </Box>
    </>
  );
};
