import { List, TablePagination, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CristinApiPath } from '../../../api/apiPaths';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { RootState } from '../../../redux/store';
import { SearchResponse } from '../../../types/common.types';
import { CristinProject } from '../../../types/project.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { useFetch } from '../../../utils/hooks/useFetch';
import { canEditProject } from '../../registration/description_tab/projects_field/projectHelpers';
import { ProjectListItem } from '../../search/project_search/ProjectListItem';

export const MyProjects = () => {
  const { t } = useTranslation();

  const user = useSelector((store: RootState) => store.user);
  const userCristinId = user?.cristinId?.split('/').pop() ?? '';

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const [projects, isLoadingProjects] = useFetch<SearchResponse<CristinProject>>({
    url: userCristinId
      ? `${CristinApiPath.Project}?query=.&page=${page + 1}&results=${rowsPerPage}&participant=${userCristinId}`
      : '',
    errorMessage: t('feedback.error.project_search'),
  });

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        {t('my_page.my_profile.my_projects')}
      </Typography>
      {isLoadingProjects ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : projects && projects.hits.length > 0 ? (
        <>
          <List>
            {projects.hits.map((project) => (
              <ProjectListItem key={project.id} project={project} showEdit={canEditProject(user, project)} />
            ))}
          </List>
          <TablePagination
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={projects.size}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(+event.target.value);
              setPage(0);
            }}
          />
        </>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}
    </div>
  );
};
