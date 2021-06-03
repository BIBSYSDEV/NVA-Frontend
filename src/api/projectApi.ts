import { CancelToken } from 'axios';
import { ProjectSearchResponse } from '../types/project.types';
import { apiRequest } from './apiRequest';

export enum ProjectsApiPaths {
  PROJECT = '/project',
}

export const searchProjectsByTitle = async (query: string, cancelToken?: CancelToken) =>
  await apiRequest<ProjectSearchResponse>({
    url: ProjectsApiPaths.PROJECT,
    params: {
      query,
    },
    cancelToken,
  });
