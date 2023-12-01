import { Box, List, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { CristinSearchPagination } from '../CristinSearchPagination';
import { SearchPageProps } from '../SearchPage';
import { ProjectListItem } from './ProjectListItem';

type ProjectSearchProps = Pick<SearchPageProps, 'projectQuery'>;

export const ProjectSearch = ({ projectQuery }: ProjectSearchProps) => {
  const { t } = useTranslation();

  const projectsSearchResults = projectQuery.data?.hits ?? [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {projectQuery.isLoading ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : projectsSearchResults && projectsSearchResults.length > 0 ? (
        <div>
          <List>
            {projectsSearchResults.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </List>
          <CristinSearchPagination totalCount={projectQuery.data?.size ?? 0} />
        </div>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}
    </Box>
  );
};
