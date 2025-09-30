import RestoreIcon from '@mui/icons-material/Restore';
import { Box, Button, SxProps, Typography } from '@mui/material';
import { useContext } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFetchProject } from '../../../api/hooks/useFetchProject';
import { ProjectListItem } from '../../../pages/search/project_search/ProjectListItem';
import { Registration } from '../../../types/registration.types';
import { isOnImportPage } from '../../../utils/urlPaths';
import { MergeResultsWizardContext } from '../MergeResultsWizardContext';

export const CompareProjects = () => {
  const { t } = useTranslation();

  const { control, formState } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);
  const sourceProjects = sourceResult.projects;

  const targetProjects = useWatch({ name: 'projects', control });
  const initialTargetProject = (formState.defaultValues?.projects ?? []) as ResearchProject[];

  return (
    <>
      <Typography variant="h3" sx={{ display: { xs: 'block', md: 'none' } }}>
        {isOnImportPage() ? t('basic_data.central_import.import_candidate') : t('unpublished_result')}
      </Typography>

      <Typography variant="h4">{t('registration.description.project_association')}</Typography>
      <Typography variant="h4" sx={{ gridColumn: 3 }}>
        {t('registration.description.project_association')}
      </Typography>

      {initialTargetProject.map((project) => (
        <CompareFile key={project.id} targetProject={project} />
      ))}

      {sourceProjects.map((project) => {
        const matchingTargetProjectIndex = targetProjects.findIndex((targetProject) => targetProject.id === project.id);
        const matchingTargetProject =
          matchingTargetProjectIndex > -1 ? targetProjects[matchingTargetProjectIndex] : undefined;
        return (
          <CompareFile
            key={project.id}
            sourceProject={project}
            targetProject={matchingTargetProject}
            matchingTargetProjectIndex={matchingTargetProjectIndex}
          />
        );
      })}
    </>
  );
};

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import { ResearchProject } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';

interface CompareFileProps {
  sourceProject?: ResearchProject;
  targetProject?: ResearchProject;
  matchingTargetProjectIndex?: number;
}

const CompareFile = ({ sourceProject, targetProject, matchingTargetProjectIndex = -1 }: CompareFileProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext<Registration>();
  const { append, remove } = useFieldArray({ name: 'projects', control });

  const canCopyProject = !!sourceProject && !targetProject;
  const projectIsCopied = matchingTargetProjectIndex > -1;

  return (
    <>
      <ProjectBox projectId={sourceProject?.id} />

      {canCopyProject && (
        <Button
          data-testid={dataTestId.basicData.centralImport.copyValueButton}
          variant="contained"
          color="secondary"
          size="small"
          endIcon={<ArrowForwardIcon />}
          onClick={() => append(sourceProject)}>
          {t('add_project')}
        </Button>
      )}
      {projectIsCopied && (
        <Button
          data-testid={dataTestId.basicData.centralImport.resetValueButton}
          variant="outlined"
          color="secondary"
          size="small"
          endIcon={<RestoreIcon />}
          onClick={() => remove(matchingTargetProjectIndex)}>
          {t('reset')}
        </Button>
      )}

      <ProjectBox projectId={targetProject?.id} sx={{ gridColumn: 3 }} />
    </>
  );
};

interface ProjectBoxProps {
  projectId?: string;
  sx?: SxProps;
}

const ProjectBox = ({ projectId, sx }: ProjectBoxProps) => {
  const projectQuery = useFetchProject(projectId);
  const project = projectQuery.data;

  if (!project) {
    return <Box sx={{ m: 0, p: '0.5rem', bgcolor: 'white', height: '100%', ...sx }} />;
  }

  return <ProjectListItem project={project} sx={sx} />;
};
