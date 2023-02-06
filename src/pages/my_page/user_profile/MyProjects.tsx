import { List, Typography } from '@mui/material';
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

  const user = useSelector((store: RootState) => store.user);
  const userCristinId = user?.cristinId?.split('/').pop() ?? '';

  const [projectsSearch, isLoadingProjectsSearch] = useFetch<SearchResponse<CristinProject>>({
    url: userCristinId ? `${CristinApiPath.Project}?query=.&participant=${userCristinId}` : '',
    errorMessage: t('feedback.error.project_search'),
  });

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        {t('my_page.my_profile.my_projects')}
      </Typography>
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
    </div>
  );
};
