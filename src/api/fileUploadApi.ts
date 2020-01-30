import Axios from 'axios';
import { getIdToken } from './userApi';
import { File } from '../types/license.types';

export enum FileUploadApiPaths {
  CREATE_MULTIPART_UPLOAD = '/upload/create',
  LIST_PARTS = '',
  PREPARE_UPLOAD_PART = '',
  ABORT_MULTIPART_UPLOAD = '',
  COMPLETE_MULTIPART_UPLOAD = '',
}

export const createMultipartUpload = async (file: File) => {
  const payload = {
    filename: file.name,
    size: file.data.size,
    lastmodified: file.data.lastModified,
    mimetype: file.data.type,
  };
  console.log('File', file);
  console.log('Payload', payload);
  const idToken = await getIdToken();
  const response = await Axios.post(FileUploadApiPaths.CREATE_MULTIPART_UPLOAD, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  console.log('Res:', response);
  return response;
};

export const listParts = async (file: any) => {};

export const prepareUploadPart = async (file: any) => {};

export const abortMultipartUpload = async (file: any) => {};

export const completeMultipartUpload = async (file: any) => {};
