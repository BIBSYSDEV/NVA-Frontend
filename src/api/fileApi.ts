import { AwsS3Part } from '@uppy/aws-s3';
import { Body, Meta, UppyFile } from '@uppy/core';
import { FileApiPath, PublicationsApiPath } from './apiPaths';
import { apiRequest2, authenticatedApiRequest, authenticatedApiRequest2 } from './apiRequest';
import { userIsAuthenticated } from './authApi';

interface DownloadImportCandidateFileResponse {
  id: string;
  shortenedVersion: string;
}

export const downloadImportCandidateFile = async (importCandidateIdentifier: string, fileIdentifier: string) => {
  const downloadFileResponse = await authenticatedApiRequest2<DownloadImportCandidateFileResponse>({
    url: `${PublicationsApiPath.ImportCandidate}/${importCandidateIdentifier}/file/${fileIdentifier}`,
  });
  return downloadFileResponse.data;
};

interface DownloadRegistrationFileResponse {
  fileIdentifier: string;
  id: string;
  alias: string;
}

export const downloadRegistrationFile = async (registrationIdentifier: string, fileIdentifier: string) => {
  const isAuthenticated = await userIsAuthenticated();
  const downloadFilePath = `${PublicationsApiPath.Registration}/${registrationIdentifier}/filelink/${fileIdentifier}`;

  const downloadFileResponse = isAuthenticated
    ? await authenticatedApiRequest2<DownloadRegistrationFileResponse>({ url: downloadFilePath })
    : await apiRequest2<DownloadRegistrationFileResponse>({ url: downloadFilePath });
  return downloadFileResponse.data;
};

export const abortMultipartUpload = async (registrationIdentifier: string, uploadId: string, key: string) => {
  const payload = {
    uploadId,
    key,
  };

  const completeResponse = await authenticatedApiRequest<any>({
    url: `${PublicationsApiPath.Registration}/${registrationIdentifier}${FileApiPath.Abort}`,
    method: 'POST',
    data: payload,
  });
  return completeResponse.data;
};

export const completeMultipartUpload = async (
  registrationIdentifier: string,
  uploadId: string,
  key: string,
  parts: AwsS3Part[]
) => {
  const payload = {
    uploadId,
    key,
    parts,
  };

  const completeResponse = await authenticatedApiRequest<any>({
    url: `${PublicationsApiPath.Registration}/${registrationIdentifier}${FileApiPath.Complete}`,
    method: 'POST',
    data: payload,
  });
  return completeResponse.data;
};

export const createMultipartUpload = async (registrationIdentifier: string, file: UppyFile<Meta, Body>) => {
  const payload = {
    filename: file.name,
    size: file.data.size,
    lastmodified: (file.data as File).lastModified,
    mimetype: file.data.type,
  };

  const createResponse = await authenticatedApiRequest<any>({
    url: `${PublicationsApiPath.Registration}/${registrationIdentifier}${FileApiPath.Create}`,
    method: 'POST',
    data: payload,
  });
  return createResponse.data;
};

export const listParts = async (registrationIdentifier: string, uploadId: string, key: string) => {
  const payload = {
    uploadId,
    key,
  };

  const listPartsResponse = await authenticatedApiRequest<any>({
    url: `${PublicationsApiPath.Registration}/${registrationIdentifier}${FileApiPath.ListParts}`,
    method: 'POST',
    data: payload,
  });
  return listPartsResponse.data;
};

export const signPart = async (
  registrationIdentifier: string,
  uploadId: string,
  key: string,
  number: number,
  body: Blob
) => {
  const payload = {
    uploadId,
    key,
    body: JSON.stringify(body),
    number,
  };

  const prepareResponse = await authenticatedApiRequest<any>({
    url: `${PublicationsApiPath.Registration}/${registrationIdentifier}${FileApiPath.Prepare}`,
    method: 'POST',
    data: payload,
  });
  return prepareResponse.data;
};

export const deleteFile = async (registrationIdentifier: string, fileIdentifier: string) => {
  const deleteResponse = await authenticatedApiRequest2<null>({
    url: `${PublicationsApiPath.Registration}/${registrationIdentifier}/file/${fileIdentifier}`,
    method: 'DELETE',
  });
  return deleteResponse.data;
};
