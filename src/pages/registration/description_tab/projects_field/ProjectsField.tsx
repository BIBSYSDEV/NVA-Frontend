import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Autocomplete, Box, Button, Divider, IconButton, Link, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldProps } from 'formik';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { searchForProjects } from '../../../../api/cristinApi';
import { AutocompleteProjectOption } from '../../../../components/AutocompleteProjectOption';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { CristinProject, ResearchProject } from '../../../../types/project.types';
import { DescriptionFieldNames } from '../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { ProjectFormDialog } from '../../../projects/form/ProjectFormDialog';
import { HelperTextModal } from '../../HelperTextModal';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { getLanguageString } from '../../../../utils/translation-helpers';
import CancelIcon from '@mui/icons-material/Cancel';
import { fundingSourceIsNfr, getNfrProjectUrl } from './projectHelpers';
import { getProjectPath } from '../../../../utils/urlPaths';
import { ListSkeleton } from '../../../../components/ListSkeleton';

export const ProjectsField = () => {
  const { t } = useTranslation();
  const [openNewProjectDialog, setOpenNewProjectDialog] = useState(false);
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
    <>
      <Divider />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h2">{t('registration.description.project_association')}</Typography>
        <HelperTextModal
          modalTitle={t('project.project')}
          modalDataTestId={dataTestId.registrationWizard.description.projectModal}>
          <Trans
            i18nKey="registration.description.project_helper_text"
            components={[<Typography key="1" paragraph />]}
          />
        </HelperTextModal>
      </Box>
      <Typography gutterBottom>{t('registration.description.add_project_helper_text')}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Field name={DescriptionFieldNames.Projects}>
          {({ field, form: { setFieldValue } }: FieldProps<ResearchProject[]>) => {
            const removeProject = (projectIdentifier: string) => {
              const updatedProjects = field.value.filter(
                (project) => getIdentifierFromId(project.id) !== projectIdentifier
              );
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
                  value={(field.value ?? []) as any[]}
                  getOptionDisabled={(option) => field.value.some((project) => project.id === option.id)}
                  loading={projectsQuery.isFetching}
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
                      isLoading={projectsQuery.isFetching}
                      placeholder={t('search.search_project_placeholder')}
                      showSearchIcon={field.value.length === 0}
                    />
                  )}
                  renderTags={() => null}
                />

                <Trans
                  i18nKey="registration.description.new_project_helper_text"
                  components={[
                    <Typography key="1">
                      <span style={{ fontWeight: 'bold' }} />
                    </Typography>,
                  ]}
                />

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    data-testid={dataTestId.registrationWizard.description.createProjectButton}
                    onClick={() => setOpenNewProjectDialog(true)}
                    startIcon={<AddIcon />}>
                    {t('project.create_project')}
                  </Button>
                  <HelperTextModal
                    modalTitle={t('project.create_project')}
                    modalDataTestId={dataTestId.registrationWizard.description.createProjectModal}>
                    <Trans
                      i18nKey="registration.description.create_project_helper_text"
                      components={[<Typography key="1" paragraph />]}
                    />
                  </HelperTextModal>
                </Box>
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

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {field.value.map((project) => (
                    <ProjectItem
                      key={project.id}
                      projectIdentifier={getIdentifierFromId(project.id)}
                      removeProject={removeProject}
                    />
                  ))}
                </Box>
              </>
            );
          }}
        </Field>
      </Box>
    </>
  );
};

interface ProjectItemProps {
  projectIdentifier: string;
  removeProject: (projectId: string) => void;
}

const ProjectItem = ({ projectIdentifier, removeProject }: ProjectItemProps) => {
  const { t } = useTranslation();
  const projectQuery = useQuery({
    enabled: !!projectIdentifier,
    queryKey: ['project', projectIdentifier],
    queryFn: () => searchForProjects(1, 1, { query: projectIdentifier }),
  });

  const project = projectQuery.data?.hits[0];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { sm: '1fr', md: '1fr 1fr auto' },
        gap: '1rem',
        bgcolor: 'secondary.light',
        p: '1rem',
        border: '1px solid lightgray',
        borderRadius: '8px',
      }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Typography fontWeight="bold">{t('project.project').toUpperCase()}</Typography>
        <Box sx={{ display: 'grid', gridTemplateRows: 'auto auto', gap: '1rem', height: '100%' }}>
          {project ? (
            <div>
              <Typography fontWeight="bold">{t('common.title')}:</Typography>
              <Box sx={{ display: 'flex', gap: '2rem' }}>
                <Link
                  data-testid={dataTestId.registrationWizard.description.projectLink(project?.id)}
                  href={getProjectPath(project?.id ?? '')}
                  target="_blank"
                  rel="noopener noreferrer">
                  {project?.title}
                </Link>
                <OpenInNewIcon fontSize="small" />
              </Box>
            </div>
          ) : (
            <ListSkeleton arrayLength={1} minWidth={20} height={20} />
          )}
          <div>
            <Typography fontWeight="bold">{t('project.coordinating_institution')}:</Typography>
            {project?.coordinatingInstitution && (
              <Typography>{getLanguageString(project?.coordinatingInstitution.labels)}</Typography>
            )}
          </div>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Typography fontWeight="bold">{t('common.funding').toUpperCase()}</Typography>
        {project?.funding?.length ? (
          project.funding.map((funding) => (
            <Box
              key={funding.identifier}
              sx={{ display: 'grid', gridTemplateRows: 'auto auto', gap: '1rem', height: '100%' }}>
              <div>
                <Typography fontWeight="bold">{t('registration.description.funding.funder')}:</Typography>
                <Typography>{getLanguageString(funding.labels)}</Typography>
              </div>
              <div>
                <Typography fontWeight="bold">{t('project.grant_id')}:</Typography>
                {funding.identifier &&
                  (fundingSourceIsNfr(funding.source) ? (
                    <Box sx={{ display: 'flex', gap: '2rem', height: 'fit-content' }}>
                      <Link
                        data-testid={dataTestId.registrationWizard.description.nfrProjectLink(funding.identifier)}
                        href={getNfrProjectUrl(funding.identifier)}
                        target="_blank"
                        rel="noopener noreferrer">
                        {funding.identifier}
                      </Link>
                      <OpenInNewIcon fontSize="small" />
                    </Box>
                  ) : (
                    <Typography>{funding.identifier}</Typography>
                  ))}
              </div>
            </Box>
          ))
        ) : (
          <Typography fontStyle="italic">{t('project.project_has_no_funding')}</Typography>
        )}
      </Box>
      <IconButton
        size="small"
        color="primary"
        onClick={() => removeProject(projectIdentifier)}
        title={t('common.remove')}
        data-testid={dataTestId.registrationWizard.description.removeProjectButton}>
        <CancelIcon />
      </IconButton>
    </Box>
  );
};
