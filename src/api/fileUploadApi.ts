import Axios from 'axios';
import { AwsS3Part } from '@uppy/aws-s3-multipart';
import { UppyFile } from '@uppy/core';

export enum FileUploadApiPaths {
  CREATE = '/upload/create',
  LIST_PARTS = '/upload/listparts',
  PREPARE = '/upload/prepare',
  ABORT = '/upload/abort',
  COMPLETE = '/upload/complete',
}

export const abortMultipartUpload = async (uploadId: string, key: string) => {
  const payload = {
    uploadId,
    key,
  };

  const response = await Axios.post(FileUploadApiPaths.ABORT, payload);
  return response.data;
};

export const completeMultipartUpload = async (uploadId: string, key: string, parts: AwsS3Part[]) => {
  const payload = {
    uploadId,
    key,
    parts,
  };

  const response = await Axios.post(FileUploadApiPaths.COMPLETE, payload);
  return response.data;
};
export const createMultipartUpload = async (file: UppyFile) => {
  const payload = {
    filename: file.name,
    size: file.data.size,
    lastmodified: (file.data as File).lastModified,
    mimetype: file.data.type,
  };

  const response = await Axios.post(FileUploadApiPaths.CREATE, payload);
  return response.data;
};

export const listParts = async (uploadId: string, key: string) => {
  const payload = {
    uploadId,
    key,
  };

  const response = await Axios.post(FileUploadApiPaths.LIST_PARTS, payload);
  return response.data;
};

export const prepareUploadPart = async (uploadId: string, key: string, body: Blob, number: number) => {
  const payload = {
    uploadId,
    key,
    body: JSON.stringify(body),
    number,
  };

  const response = await Axios.post(FileUploadApiPaths.PREPARE, payload);
  return response.data;
};
