import { Box, SxProps } from '@mui/material';
import { useFetchProject } from '../../../api/hooks/useFetchProject';
import { ProjectListItem } from '../../../pages/search/project_search/ProjectListItem';

interface ProjectBoxProps {
  projectId?: string;
  sx?: SxProps;
}

export const ProjectBox = ({ projectId, sx }: ProjectBoxProps) => {
  const projectQuery = useFetchProject(projectId);
  const project = projectQuery.data;

  if (!project) {
    return <Box sx={{ m: 0, p: '0.5rem', bgcolor: 'white', height: '100%', ...sx }} />;
  }

  return <ProjectListItem project={project} sx={sx} />;
};
