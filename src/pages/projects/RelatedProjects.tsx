import { List } from '@mui/material';
import { useEffect, useState } from 'react';
import { authenticatedApiRequest } from '../../api/apiRequest';
import { CristinProject } from '../../types/project.types';
import { isSuccessStatus } from '../../utils/constants';
import { ProjectListItem } from '../search/project_search/ProjectListItem';

interface RelatedProjectsProps {
  projectIds: string[];
}

export const RelatedProjects = ({ projectIds }: RelatedProjectsProps) => {
  const [projects, setProjects] = useState<CristinProject[]>([]);
  const [isLoading, setIsLoading] = useState(projectIds.length > 0);

  useEffect(() => {
    // TODO: can this be done by one search request instead?
    const projectsToFetch = projectIds.slice(0, 10);
    const fetchRelatedProjects = async () => {
      setIsLoading(true);
      const allowedCustomersPromises = projectsToFetch.map(async (id) => {
        const projectResponse = await authenticatedApiRequest<CristinProject>({ url: id });
        if (isSuccessStatus(projectResponse.status)) {
          return projectResponse.data;
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
  }, [projectIds]);

  return (
    <>
      <List>
        {projects.map((project) => (
          <ProjectListItem key={project.id} project={project} />
        ))}
      </List>
    </>
  );
};
