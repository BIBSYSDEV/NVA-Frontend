import { API_URL } from '../../utils/constants';
import { CristinApiPath } from '../apiPaths';
import { useFetchOrganization } from './useFetchOrganization';

export const useFetchOrganizationByIdentifier = (identifier: string) => {
  const uri = `${API_URL}${CristinApiPath.Organization.substring(1)}/${identifier}`;
  return useFetchOrganization(uri);
};
