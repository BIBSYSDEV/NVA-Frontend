import { Box, SxProps, Typography } from '@mui/material';
import { Fragment, useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
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
  const initialTargetProject = formState.defaultValues?.projects;

  return (
    <>
      <Typography variant="h3" sx={{ display: { xs: 'block', md: 'none' } }}>
        {isOnImportPage() ? t('basic_data.central_import.import_candidate') : t('unpublished_result')}
      </Typography>

      {targetProjects.map((project) => (
        <Fragment key={project.id}>
          <ProjectBox />
          <ProjectBox projectId={project.id} sx={{ gridColumn: 3 }} />
        </Fragment>
      ))}

      {sourceProjects.map((project) => (
        <Fragment key={project.id}>
          <ProjectBox projectId={project.id} />
          <ProjectBox sx={{ gridColumn: 3 }} />
        </Fragment>
      ))}
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
    return <Box sx={{ m: 0, p: '0.5rem', bgcolor: '#FEFBF3', height: '100%', ...sx }} />;
  } else {
    return <ProjectListItem project={project} sx={sx} />;
  }
};
