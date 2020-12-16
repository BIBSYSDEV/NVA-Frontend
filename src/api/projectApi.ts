import { CancelToken } from 'axios';
import { CristinProject } from '../types/project.types';
import { authenticatedApiRequest } from './apiRequest';

export enum ProjectsApiPaths {
  PROJECT = '/project',
}

export const searchProjectsByTitle = async (query: string, cancelToken?: CancelToken) =>
  authenticatedApiRequest<CristinProject[]>({
    url: ProjectsApiPaths.PROJECT,
    params: {
      title: query,
    },
    cancelToken,
  });
