import Axios from 'axios';
import { getIdToken } from './userApi';
import { File } from '../types/license.types';

interface Part {
  ETag: string;
  PartNumber: number;
}

export enum FileUploadApiPaths {
  CREATE = '/upload/create',
  LIST_PARTS = '/upload/listparts',
  PREPARE = '/upload/prepare',
  ABORT = '/upload/abort',
  COMPLETE = '/upload/complete',
}

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
  return response;
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
  return response;
};

export const prepareUploadPart = async (partData: any) => {
  const payload = partData;

  const idToken = await getIdToken();
  const response = await Axios.post(FileUploadApiPaths.PREPARE, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response;
};

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
  return response;
};

export const completeMultipartUpload = async (uploadId: string, key: string, parts: Part[]) => {
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
  return response;
};
