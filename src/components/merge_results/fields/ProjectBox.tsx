import { SxProps } from '@mui/material';
import { useFetchProject } from '../../../api/hooks/useFetchProject';
import { ProjectListItem } from '../../../pages/search/project_search/ProjectListItem';
import { StyledValueBox } from './MissingCompareValues';

interface ProjectBoxProps {
  projectId?: string;
  sx?: SxProps;
}

export const ProjectBox = ({ projectId, sx }: ProjectBoxProps) => {
  const projectQuery = useFetchProject(projectId);

  if (!projectQuery.data) {
    return <StyledValueBox sx={sx} />;
  }

  return <ProjectListItem project={projectQuery.data} sx={sx} />;
};
