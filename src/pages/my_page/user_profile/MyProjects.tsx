import { List, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { searchForProjects } from '../../../api/cristinApi';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { RootState } from '../../../redux/store';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { canEditProject } from '../../registration/description_tab/projects_field/projectHelpers';
import { ProjectListItem } from '../../search/project_search/ProjectListItem';

export const MyProjects = () => {
  const { t } = useTranslation();

  const user = useSelector((store: RootState) => store.user);
  const userCristinId = getIdentifierFromId(user?.cristinId ?? '');

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const projectsQuery = useQuery({
    queryKey: ['projects', rowsPerPage, page, userCristinId],
    queryFn: () => searchForProjects(rowsPerPage, page, { participant: userCristinId }),
    meta: { errorMessage: t('feedback.error.project_search') },
  });

  const projects = projectsQuery.data?.hits ?? [];

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        {t('my_page.my_profile.my_projects')}
      </Typography>
      {projectsQuery.isPending ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : projects && projects.length > 0 ? (
        <ListPagination
          count={projectsQuery.data?.size ?? 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(1);
          }}>
          <List>
            {projects.map((project) => (
              <ProjectListItem
                key={project.id}
                project={project}
                showEdit={canEditProject(user, project)}
                refetchProjects={projectsQuery.refetch}
              />
            ))}
          </List>
        </ListPagination>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}
    </div>
  );
};
