import { isSuccessStatus } from '../utils/constants';
import { FileApiPath } from './apiPaths';
import { apiRequest, authenticatedApiRequest } from './apiRequest';

interface DownloadFileResponse {
  presignedDownloadUrl: string;
}

export const downloadFile = async (registrationIdentifier: string, fileId: string) => {
  try {
    const authenticatedResponse = await authenticatedApiRequest<DownloadFileResponse>({
      url: `${FileApiPath.Download}/${registrationIdentifier}/files/${fileId}`,
    });
    if (isSuccessStatus(authenticatedResponse.status)) {
      return authenticatedResponse.data;
    }
  } catch {
    const publicDownloadResponse = await apiRequest<DownloadFileResponse>({
      url: `${FileApiPath.PublicDownload}/${registrationIdentifier}/files/${fileId}`,
    });
    if (isSuccessStatus(publicDownloadResponse.status)) {
      return publicDownloadResponse.data;
    }
  }

  return null;
};
