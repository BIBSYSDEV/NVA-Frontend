import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Typography, List, TablePagination } from '@mui/material';
import { useState } from 'react';
import { searchForProjects } from '../../../api/cristinApi';
import { RootState } from '../../../redux/store';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { canEditProject } from '../../registration/description_tab/projects_field/projectHelpers';
import { ProjectListItem } from '../../search/project_search/ProjectListItem';

interface MyProjectRegistrationsProps {
  selectedOngoing?: boolean;
  selectedNotStarted?: boolean;
  selectedConcluded?: boolean;
}

export const MyProjectRegistrations = ({
  selectedOngoing,
  selectedNotStarted,
  selectedConcluded,
}: MyProjectRegistrationsProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const cristinIdentifier = getIdentifierFromId(user?.cristinId ?? '');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const projectsQuery = useQuery({
    enabled: !!cristinIdentifier,
    queryKey: ['projects', 50, 1, cristinIdentifier],
    queryFn: () => searchForProjects(50, 1, { creator: cristinIdentifier }),
  });

  const projects = projectsQuery.data?.hits ?? [];
  const filteredProjects = projects
    .filter(
      ({ status }) =>
        (status === 'ACTIVE' && selectedOngoing) ||
        (status === 'NOTSTARTED' && selectedNotStarted) ||
        (status === 'CONCLUDED' && selectedConcluded)
    )
    .sort((a, b) => {
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

  const projectsToShow = filteredProjects.slice(rowsPerPage * page, rowsPerPage * (page + 1));

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        {t('my_page.project_registrations')}
      </Typography>
      {projectsQuery.isLoading ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : projectsQuery.data && projectsQuery.data.size > 0 ? (
        <>
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
          <TablePagination
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={filteredProjects.length}
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
