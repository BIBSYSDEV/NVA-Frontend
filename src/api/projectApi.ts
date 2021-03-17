import { CancelToken } from 'axios';
import { CristinProject } from '../types/project.types';
import { authenticatedApiRequest } from './apiRequest';

export enum ProjectsApiPaths {
  PROJECT = '/project',
}

interface ProjectSearchResponse {
  numberOfResults: number;
  hits: CristinProject[];
}

export const searchProjectsByTitle = async (query: string, cancelToken?: CancelToken) =>
  await authenticatedApiRequest<ProjectSearchResponse>({
    url: ProjectsApiPaths.PROJECT,
    params: {
      title: query,
    },
    cancelToken,
  });
