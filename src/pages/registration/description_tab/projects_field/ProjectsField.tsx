import AddIcon from '@mui/icons-material/Add';
import { Autocomplete, Box, Button, Divider, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { searchForProjects } from '../../../../api/cristinApi';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteProjectOption } from '../../../../components/AutocompleteProjectOption';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { CristinProject, ResearchProject } from '../../../../types/project.types';
import { DescriptionFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { keepSimilarPreviousData } from '../../../../utils/searchHelpers';
import { ProjectModal } from '../../../project/ProjectModal';
import { HelperTextModal } from '../../HelperTextModal';
import { ProjectItem } from './ProjectItem';

const defaultProjectSearchSize = 10;

export const ProjectsField = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<Registration>();
  const [openNewProject, setOpenNewProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [searchSize, setSearchSize] = useState(defaultProjectSearchSize);

  // Reset search size when query changes
  useEffect(() => setSearchSize(defaultProjectSearchSize), [debouncedSearchTerm]);

  const projectsQuery = useQuery({
    enabled: debouncedSearchTerm.length > 0,
    queryKey: ['projects', searchSize, 1, debouncedSearchTerm],
    queryFn: () => searchForProjects(searchSize, 1, { query: debouncedSearchTerm }),
    meta: { errorMessage: t('feedback.error.project_search') },
    placeholderData: (data, query) => keepSimilarPreviousData(data, query, debouncedSearchTerm),
  });

  const toggleOpenNewProject = () => setOpenNewProject(!openNewProject);

  const addProject = (value: CristinProject | ResearchProject) => {
    const projectToPersist: ResearchProject = {
      type: 'ResearchProject',
      id: value.id,
      name: 'title' in value ? value.title : 'name' in value ? value.name : '',
    };
    setFieldValue(DescriptionFieldNames.Projects, values.projects.concat([projectToPersist]));
  };

  const projects = projectsQuery.data?.hits ?? [];

  return (
    <>
      <Divider />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h2">{t('registration.description.project_association')}</Typography>
        <HelperTextModal
          modalTitle={t('project.project')}
          modalDataTestId={dataTestId.registrationWizard.description.projectModal}>
          <Trans
            i18nKey="registration.description.project_helper_text"
            components={[<Typography key="1" sx={{ mb: '1rem' }} />]}
          />
        </HelperTextModal>
      </Box>
      <Typography gutterBottom>{t('registration.description.add_project_helper_text')}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Field name={DescriptionFieldNames.Projects}>
          {({ field, form: { setFieldValue } }: FieldProps<ResearchProject[]>) => {
            const removeProject = (projectId: string) => {
              const updatedProjects = field.value.filter((project) => project.id !== projectId);
              setFieldValue(field.name, updatedProjects);
            };

            return (
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
                  disableClearable
                  value={(field.value ?? []) as any[]}
                  getOptionDisabled={(option) => field.value.some((project) => project.id === option.id)}
                  loading={projectsQuery.isFetching}
                  slotProps={{
                    listbox: {
                      component: AutocompleteListboxWithExpansion,
                      ...({
                        hasMoreHits: !!projectsQuery.data?.size && projectsQuery.data.size > searchSize,
                        onShowMoreHits: () => setSearchSize(searchSize + defaultProjectSearchSize),
                        isLoadingMoreHits: projectsQuery.isFetching && searchSize > projects.length,
                      } satisfies AutocompleteListboxWithExpansionProps),
                    },
                  }}
                  renderOption={({ key, ...props }, option: CristinProject, state) => (
                    <AutocompleteProjectOption
                      key={option.id}
                      project={option}
                      inputValue={state.inputValue}
                      props={props}
                    />
                  )}
                  renderInput={(params) => (
                    <AutocompleteTextField
                      {...params}
                      label={t('registration.description.project_association')}
                      isLoading={projectsQuery.isLoading}
                      placeholder={t('search.search_project_placeholder')}
                      showSearchIcon
                    />
                  )}
                  renderTags={() => null}
                />

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: '0.5rem' }}>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {t('registration.description.new_project_helper_text')}
                  </Typography>

                  <HelperTextModal
                    modalTitle={t('project.create_project')}
                    modalDataTestId={dataTestId.registrationWizard.description.createProjectModal}>
                    <Trans
                      i18nKey="registration.description.create_project_helper_text"
                      components={[<Typography key="1" sx={{ mb: '1rem' }} />]}
                    />
                  </HelperTextModal>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Button
                    data-testid={dataTestId.registrationWizard.description.createProjectButton}
                    onClick={toggleOpenNewProject}
                    startIcon={<AddIcon />}>
                    {t('project.create_new_project')}
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {field.value.map((project) => (
                    <ProjectItem key={project.id} projectId={project.id} removeProject={removeProject} />
                  ))}
                </Box>
              </>
            );
          }}
        </Field>
      </Box>
      <ProjectModal isOpen={openNewProject} toggleModal={toggleOpenNewProject} onProjectCreated={addProject} />
    </>
  );
};
