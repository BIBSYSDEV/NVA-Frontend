import { Uppy } from '@uppy/core';
import AwsS3Multipart from '@uppy/aws-s3-multipart';
import {
  createMultipartUpload,
  listParts,
  prepareUploadPart,
  abortMultipartUpload,
  completeMultipartUpload,
} from '../api/fileUploadApi';
import { File } from '../types/license.types';

export const createUppy = () =>
  new Uppy({
    autoProceed: true,
  }).use(AwsS3Multipart, {
    createMultipartUpload: async (file: File) => await createMultipartUpload(file),
    listParts: async (_: File, { uploadedId, key }: any) => await listParts(uploadedId, key),
    prepareUploadPart: async (_: File, partData: any) => await prepareUploadPart(partData),
    abortMultipartUpload: async (_: File, { uploadedId, key }: any) => await abortMultipartUpload(uploadedId, key),
    completeMultipartUpload: async (_: File, { uploadedId, key, parts }: any) =>
      await completeMultipartUpload(uploadedId, key, parts),
  });
