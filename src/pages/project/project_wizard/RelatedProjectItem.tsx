import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchProject } from '../../../api/hooks/useFetchProject';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { ProjectListItem } from '../../search/project_search/ProjectListItem';

interface RelatedProjectItemProps {
  projectId: string;
}

export const RelatedProjectItem = ({ projectId }: RelatedProjectItemProps) => {
  const { t } = useTranslation();
  const projectQuery = useFetchProject(projectId);
  const project = projectQuery.data;

  return projectQuery.isPending ? (
    <SearchListItem sx={{ borderLeftColor: 'project.main' }}>
      <ListSkeleton arrayLength={4} maxWidth={60} height={20} />
    </SearchListItem>
  ) : project ? (
    <ProjectListItem key={projectId} project={project} showEdit={false} refetchProjects={projectQuery.refetch} />
  ) : (
    <Typography>{t('feedback.error.get_project')}</Typography>
  );
};
