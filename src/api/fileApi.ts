import { AwsS3Part } from '@uppy/aws-s3-multipart';
import { UppyFile } from '@uppy/core';
import { isSuccessStatus } from '../utils/constants';
import { FileApiPath, PublicationsApiPath } from './apiPaths';
import { apiRequest, authenticatedApiRequest, authenticatedApiRequest2 } from './apiRequest';

interface DownloadFileResponse {
  id: string;
  shortenedVersion: string;
}

export const downloadImportCandidateFile = async (importCandidateIdentifier: string, fileIdentifier: string) => {
  const downloadFileResponse = await authenticatedApiRequest2<DownloadFileResponse>({
    url: `${PublicationsApiPath.ImportCandidate}/${importCandidateIdentifier}/file/${fileIdentifier}`,
  });
  return downloadFileResponse.data;
};

export const downloadPrivateFile2 = async (registrationIdentifier: string, fileIdentifier: string) => {
  const downloadFileResponse = await authenticatedApiRequest2<DownloadFileResponse>({
    url: `${FileApiPath.Download}/${registrationIdentifier}/files/${fileIdentifier}`,
  });
  return downloadFileResponse.data;
};

export const downloadPrivateFile = async (registrationIdentifier: string, fileIdentifier: string) => {
  const downloadFileResponse = await authenticatedApiRequest<DownloadFileResponse>({
    url: `${FileApiPath.Download}/${registrationIdentifier}/files/${fileIdentifier}`,
  });
  if (isSuccessStatus(downloadFileResponse.status)) {
    return downloadFileResponse.data;
  }
  return null;
};

export const downloadPublicFile = async (registrationIdentifier: string, fileIdentifier: string) => {
  const downloadFileResponse = await apiRequest<DownloadFileResponse>({
    url: `${FileApiPath.PublicDownload}/${registrationIdentifier}/files/${fileIdentifier}`,
  });
  if (isSuccessStatus(downloadFileResponse.status)) {
    return downloadFileResponse.data;
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

export const signPart = async (uploadId: string, key: string, number: number, body: Blob) => {
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
