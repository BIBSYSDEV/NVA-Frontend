import Axios from 'axios';
import { getIdToken } from './userApi';
import { AwsS3Part } from '@uppy/aws-s3-multipart';
import { UppyFile } from '@uppy/core';

export enum FileApiPaths {
  CREATE = '/upload/create',
  LIST_PARTS = '/upload/listparts',
  PREPARE = '/upload/prepare',
  ABORT = '/upload/abort',
  COMPLETE = '/upload/complete',
  DOWNLOAD = '/download',
}

export const downloadFile = async (publicationId: string, fileId: string) => {
  const url = `${FileApiPaths.DOWNLOAD}/${publicationId}/files/${fileId}`;
  try {
    const idToken = await getIdToken();
    const response = await Axios.get(url, { headers: { Authorization: `Bearer ${idToken}` } });
    if (response) {
      return response.data.presignedDownloadUrl;
    } else {
      console.log('error response');
    }
  } catch (e) {
    console.log('error', e);
  }
};

export const abortMultipartUpload = async (uploadId: string, key: string) => {
  const payload = {
    uploadId,
    key,
  };

  const idToken = await getIdToken();
  const response = await Axios.post(FileApiPaths.ABORT, payload, {
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
  const response = await Axios.post(FileApiPaths.COMPLETE, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data;
};
export const createMultipartUpload = async (file: UppyFile) => {
  const payload = {
    filename: file.name,
    size: file.data.size,
    lastmodified: (file.data as File).lastModified,
    mimetype: file.data.type,
  };

  const idToken = await getIdToken();
  const response = await Axios.post(FileApiPaths.CREATE, payload, {
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
  const response = await Axios.post(FileApiPaths.LIST_PARTS, payload, {
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
  const response = await Axios.post(FileApiPaths.PREPARE, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data;
};
