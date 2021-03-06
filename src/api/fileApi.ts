import { AwsS3Part } from '@uppy/aws-s3-multipart';
import { UppyFile } from '@uppy/core';
import { isSuccessStatus } from '../utils/constants';
import { FileApiPath } from './apiPaths';
import { apiRequest, authenticatedApiRequest } from './apiRequest';

interface DownloadFileResponse {
  presignedDownloadUrl: string;
}

export const downloadFile = async (registrationId: string, fileId: string) => {
  try {
    const authenticatedResponse = await authenticatedApiRequest<DownloadFileResponse>({
      url: `${FileApiPath.Download}/${registrationId}/files/${fileId}`,
    });
    if (isSuccessStatus(authenticatedResponse.status)) {
      return authenticatedResponse.data.presignedDownloadUrl;
    }
  } catch {
    const publicDownloadResponse = await apiRequest<DownloadFileResponse>({
      url: `${FileApiPath.PublicDownload}/${registrationId}/files/${fileId}`,
    });
    if (isSuccessStatus(publicDownloadResponse.status)) {
      return publicDownloadResponse.data.presignedDownloadUrl;
    }
  }

  return null;
};

export const abortMultipartUpload = async (uploadId: string, key: string) => {
  const payload = {
    uploadId,
    key,
  };

  const completeResponse = await authenticatedApiRequest<any>({
    url: FileApiPath.Abort,
    method: 'POST',
    data: payload,
  });
  return completeResponse.data;
};

export const completeMultipartUpload = async (uploadId: string, key: string, parts: AwsS3Part[]) => {
  const payload = {
    uploadId,
    key,
    parts,
  };

  const completeResponse = await authenticatedApiRequest<any>({
    url: FileApiPath.Complete,
    method: 'POST',
    data: payload,
  });
  return completeResponse.data;
};
export const createMultipartUpload = async (file: UppyFile) => {
  const payload = {
    filename: file.name,
    size: file.data.size,
    lastmodified: (file.data as File).lastModified,
    mimetype: file.data.type,
  };

  const createResponse = await authenticatedApiRequest<any>({
    url: FileApiPath.Create,
    method: 'POST',
    data: payload,
  });
  return createResponse.data;
};

export const listParts = async (uploadId: string, key: string) => {
  const payload = {
    uploadId,
    key,
  };

  const listPartsResponse = await authenticatedApiRequest<any>({
    url: FileApiPath.ListParts,
    method: 'POST',
    data: payload,
  });
  return listPartsResponse.data;
};

export const prepareUploadPart = async (uploadId: string, key: string, body: Blob, number: number) => {
  const payload = {
    uploadId,
    key,
    body: JSON.stringify(body),
    number,
  };

  const prepareResponse = await authenticatedApiRequest<any>({
    url: FileApiPath.Prepare,
    method: 'POST',
    data: payload,
  });
  return prepareResponse.data;
};
