import { CancelToken } from 'axios';
import { CristinProject } from '../types/project.types';
import { authenticatedApiRequest } from './apiRequest';

export enum ProjectsApiPaths {
  PROJECT = '/project',
}

export const searchProjectsByTitle = async (query: string, cancelToken?: CancelToken) => {
  const url = `${ProjectsApiPaths.PROJECT}?title=${encodeURIComponent(query)}`;

  return authenticatedApiRequest<CristinProject[]>({
    url,
    cancelToken,
  });
};
