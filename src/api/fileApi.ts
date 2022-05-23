import { isSuccessStatus } from '../utils/constants';
import { FileApiPath } from './apiPaths';
import { apiRequest, authenticatedApiRequest } from './apiRequest';

interface DownloadFileResponse {
  id: string;
  expires: string;
}

export const downloadPrivateFile = async (registrationIdentifier: string, fileId: string) => {
  const downloadFileResponse = await authenticatedApiRequest<DownloadFileResponse>({
    url: `${FileApiPath.Download}/${registrationIdentifier}/files/${fileId}`,
  });
  if (isSuccessStatus(downloadFileResponse.status)) {
    return downloadFileResponse.data;
  }
  return null;
};

export const downloadPublicFile = async (registrationIdentifier: string, fileId: string) => {
  const downloadFileResponse = await apiRequest<DownloadFileResponse>({
    url: `${FileApiPath.PublicDownload}/${registrationIdentifier}/files/${fileId}`,
  });
  if (isSuccessStatus(downloadFileResponse.status)) {
    return downloadFileResponse.data;
  }
  return null;
};
