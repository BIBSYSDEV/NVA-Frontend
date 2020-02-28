import Axios from 'axios';
import { getIdToken } from './userApi';
import { File } from '../types/file.types';
import { AwsS3Part } from '@uppy/aws-s3-multipart';

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

  const idToken = await getIdToken();
  const response = await Axios.post(FileUploadApiPaths.ABORT, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data;
};

export const completeMultipartUpload = async (uploadId: string, key: string, parts: AwsS3Part[]) => {
  const payload = {
    uploadId,
    key,
    parts,
  };

  const idToken = await getIdToken();
  const response = await Axios.post(FileUploadApiPaths.COMPLETE, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data;
};
export const createMultipartUpload = async (file: File) => {
  const payload = {
    filename: file.name,
    size: file.data.size,
    lastmodified: file.data.lastModified,
    mimetype: file.data.type,
  };

  const idToken = await getIdToken();
  const response = await Axios.post(FileUploadApiPaths.CREATE, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data;
};

export const listParts = async (uploadId: string, key: string) => {
  const payload = {
    uploadId,
    key,
  };

  const idToken = await getIdToken();
  const response = await Axios.post(FileUploadApiPaths.LIST_PARTS, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data;
};

export const prepareUploadPart = async (uploadId: string, key: string, body: Blob, number: number) => {
  const payload = {
    uploadId,
    key,
    body: JSON.stringify(body),
    number,
  };

  const idToken = await getIdToken();
  const response = await Axios.post(FileUploadApiPaths.PREPARE, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data;
};
