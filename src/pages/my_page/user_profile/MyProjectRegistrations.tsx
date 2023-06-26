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
  selectedEnded?: boolean;
}

export const MyProjectRegistrations = ({
  selectedOngoing,
  selectedNotStarted,
  selectedEnded,
}: MyProjectRegistrationsProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const cristinIdentifier = getIdentifierFromId(user?.cristinId ?? '');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const projectsQuery = useQuery({
    enabled: !!cristinIdentifier,
    queryKey: ['projects', rowsPerPage, page, cristinIdentifier],
    queryFn: () => searchForProjects(rowsPerPage, page + 1, { creator: cristinIdentifier }),
  });

  const projects = projectsQuery.data?.hits ?? [];
  const filteredProjects = projects.filter(
    ({ status }) =>
      (status === 'ACTIVE' && selectedOngoing) ||
      (status === 'CONCLUDED' && selectedEnded) ||
      (status === 'NOTSTARTED' && selectedNotStarted)
  );

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
            {filteredProjects.map((project) => (
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
            count={projectsQuery.data.size}
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
