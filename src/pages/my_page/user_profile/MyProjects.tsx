import { Box, List, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CristinApiPath } from '../../../api/apiPaths';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { RootState } from '../../../redux/store';
import { SearchResponse } from '../../../types/common.types';
import { CristinProject } from '../../../types/project.types';
import { useFetch } from '../../../utils/hooks/useFetch';
import { CristinSearchPagination } from '../../search/CristinSearchPagination';
import { ProjectListItem } from '../../search/project_search/ProjectListItem';

export const MyProjects = () => {
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = useSelector((store: RootState) => store.user)!; // If user has been empty this route would already be blocked
  const userCristinId = user.cristinId?.split('/').pop();

  const queryParams = `?query=.&participant=${userCristinId}`;

  const [projectsSearch, isLoadingProjectsSearch] = useFetch<SearchResponse<CristinProject>>({
    url: queryParams ? `${CristinApiPath.Project}?${queryParams}` : '',
    errorMessage: t('feedback.error.project_search'),
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {isLoadingProjectsSearch ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : projectsSearch && projectsSearch.hits.length > 0 ? (
        <>
          <List>
            {projectsSearch.hits.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </List>
          <CristinSearchPagination totalCount={projectsSearch.size} />
        </>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}
    </Box>
  );
};
