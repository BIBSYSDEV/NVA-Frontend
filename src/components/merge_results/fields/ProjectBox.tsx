import { Box, styled, SxProps } from '@mui/material';
import { useFetchProject } from '../../../api/hooks/useFetchProject';
import { ProjectListItem } from '../../../pages/search/project_search/ProjectListItem';

interface ProjectBoxProps {
  projectId?: string;
  sx?: SxProps;
}

export const StyledEmptyProjectBox = styled(Box)({
  margin: 0,
  padding: '0.5rem',
  background: 'white',
  height: '100%',
});

export const ProjectBox = ({ projectId, sx }: ProjectBoxProps) => {
  const projectQuery = useFetchProject(projectId);
  const project = projectQuery.data;

  if (!project) {
    return <StyledEmptyProjectBox sx={sx} />;
  }

  return <ProjectListItem project={project} sx={sx} />;
};
