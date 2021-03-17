import { CancelToken } from 'axios';
import { ProjectSearchResponse } from '../types/project.types';
import { authenticatedApiRequest } from './apiRequest';

export enum ProjectsApiPaths {
  PROJECT = '/project',
}

export const searchProjectsByTitle = async (query: string, cancelToken?: CancelToken) =>
  await authenticatedApiRequest<ProjectSearchResponse>({
    url: ProjectsApiPaths.PROJECT,
    params: {
      title: query,
    },
    cancelToken,
  });
