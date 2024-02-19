import { CircularProgress, List, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { apiRequest } from '../../api/apiRequest';
import { ListPagination } from '../../components/ListPagination';
import { setNotification } from '../../redux/notificationSlice';
import { CristinProject } from '../../types/project.types';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { ProjectListItem } from '../search/project_search/ProjectListItem';

interface RelatedProjectsProps {
  projectIds: string[];
}

const itemsPerRowOptions = [5, 10];

export const RelatedProjects = ({ projectIds }: RelatedProjectsProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [projects, setProjects] = useState<CristinProject[]>([]);
  const [isLoading, setIsLoading] = useState(projectIds.length > 0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerRowOptions[0]);

  useEffect(() => {
    const projectsToFetch = projectIds.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    const fetchRelatedProjects = async () => {
      setIsLoading(true);
      const allowedCustomersPromises = projectsToFetch.map(async (id) => {
        try {
          const projectResponse = await apiRequest<CristinProject>({ url: id });
          if (isSuccessStatus(projectResponse.status)) {
            return projectResponse.data;
          } else if (isErrorStatus(projectResponse.status)) {
            dispatch(setNotification({ message: t('feedback.error.get_project'), variant: 'error' }));
            return;
          }
        } catch {
          dispatch(setNotification({ message: t('feedback.error.get_project'), variant: 'error' }));
          return;
        }
      });
      const fetchedProjects = (await Promise.all(allowedCustomersPromises)).filter(
        (project) => project // Remove null/undefined objects
      ) as CristinProject[];

      setProjects(fetchedProjects);
      setIsLoading(false);
    };

    if (projectIds.length > 0) {
      fetchRelatedProjects();
    }
  }, [dispatch, t, projectIds, page, rowsPerPage]);

  return isLoading ? (
    <CircularProgress aria-label={t('project.form.related_projects')} />
  ) : projects.length > 0 ? (
    <ListPagination
      rowsPerPageOptions={itemsPerRowOptions}
      count={projectIds.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={(newPage) => setPage(newPage)}
      onRowsPerPageChange={(newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setPage(1);
      }}>
      <List>
        {projects.map((project) => (
          <ProjectListItem key={project.id} project={project} />
        ))}
      </List>
    </ListPagination>
  ) : (
    <Typography>{t('project.no_related_projects')}</Typography>
  );
};
