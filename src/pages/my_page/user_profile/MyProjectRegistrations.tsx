import { List, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  ProjectSearchOrder,
  ProjectSearchParameter,
  ProjectsSearchParams,
  searchForProjects,
} from '../../../api/cristinApi';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { ProjectSortSelector } from '../../../components/ProjectSortSelector';
import { RootState } from '../../../redux/store';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { canEditProject } from '../../registration/description_tab/projects_field/projectHelpers';
import { ProjectListItem } from '../../search/project_search/ProjectListItem';

export const MyProjectRegistrations = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user = useSelector((store: RootState) => store.user);
  const cristinIdentifier = getIdentifierFromId(user?.cristinId ?? '');

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const projectQueryParams: ProjectsSearchParams = {
    orderBy: searchParams.get(ProjectSearchParameter.OrderBy) as ProjectSearchOrder | null,
    sort: searchParams.get(ProjectSearchParameter.Sort),
    creator: cristinIdentifier,
  };

  const projectsQuery = useQuery({
    enabled: !!cristinIdentifier,
    queryKey: ['projects', 50, 1, projectQueryParams],
    queryFn: () => searchForProjects(50, 1, projectQueryParams),
  });

  const projects = projectsQuery.data?.hits ?? [];
  const filteredProjects = projects.sort((a, b) => {
    if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') {
      return -1;
    } else if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') {
      return 1;
    } else if (a.status === 'NOTSTARTED' && b.status !== 'NOTSTARTED') {
      return -1;
    } else if (a.status !== 'NOTSTARTED' && b.status === 'NOTSTARTED') {
      return 1;
    }
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const projectsToShow = filteredProjects.slice(rowsPerPage * (page - 1), rowsPerPage * page);
  const validPage = page - 1 < Math.ceil(filteredProjects.length / rowsPerPage) ? page : 1;

  return (
    <div>
      <Helmet>
        <title>{t('my_page.project_registrations')}</title>
      </Helmet>
      <Typography variant="h2" gutterBottom>
        {t('my_page.project_registrations')}
      </Typography>
      {projectsQuery.isPending || projectsQuery.isFetching ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : projectsQuery.data && projectsQuery.data.size > 0 ? (
        <ListPagination
          count={filteredProjects.length}
          rowsPerPage={rowsPerPage}
          page={validPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(1);
          }}
          sortingComponent={<ProjectSortSelector />}>
          <List>
            {projectsToShow.map((project) => (
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
