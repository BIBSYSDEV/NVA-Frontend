import { CircularProgress, List, TablePagination, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authenticatedApiRequest } from '../../api/apiRequest';
import { CristinProject } from '../../types/project.types';
import { isSuccessStatus } from '../../utils/constants';
import { ProjectListItem } from '../search/project_search/ProjectListItem';

interface RelatedProjectsProps {
  projectIds: string[];
}

const itemsPerRow = 5;

export const RelatedProjects = ({ projectIds }: RelatedProjectsProps) => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<CristinProject[]>([]);
  const [isLoading, setIsLoading] = useState(projectIds.length > 0);

  const [page, setPage] = useState(0);

  useEffect(() => {
    const projectsToFetch = projectIds.slice(page * itemsPerRow, (page + 1) * itemsPerRow);
    const fetchRelatedProjects = async () => {
      setIsLoading(true);
      const allowedCustomersPromises = projectsToFetch.map(async (id) => {
        const projectResponse = await authenticatedApiRequest<CristinProject>({ url: id });
        if (isSuccessStatus(projectResponse.status)) {
          return projectResponse.data;
        } else {
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
  }, [projectIds, page]);

  return isLoading ? (
    <CircularProgress />
  ) : projects.length > 0 ? (
    <>
      <List>
        {projects.map((project) => (
          <ProjectListItem key={project.id} project={project} />
        ))}
      </List>
      <TablePagination
        rowsPerPageOptions={[itemsPerRow]}
        component="div"
        count={projectIds.length}
        rowsPerPage={itemsPerRow}
        page={page}
        onPageChange={(_, muiPage) => setPage(muiPage)}
      />
    </>
  ) : (
    <Typography>{t('project.no_related_projects')}</Typography>
  );
};
