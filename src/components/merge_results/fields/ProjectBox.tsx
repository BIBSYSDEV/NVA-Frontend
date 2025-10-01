import { Box, styled, SxProps } from '@mui/material';
import { useFetchProject } from '../../../api/hooks/useFetchProject';
import { ProjectListItem } from '../../../pages/search/project_search/ProjectListItem';

export const StyledEmptyProjectBox = styled(Box)({
  padding: '0.5rem',
  background: 'white',
  height: '100%',
});

interface ProjectBoxProps {
  projectId?: string;
  sx?: SxProps;
}

export const ProjectBox = ({ projectId, sx }: ProjectBoxProps) => {
  const projectQuery = useFetchProject(projectId);

  if (!projectQuery.data) {
    return <StyledEmptyProjectBox sx={sx} />;
  }

  return <ProjectListItem project={projectQuery.data} sx={sx} />;
};
