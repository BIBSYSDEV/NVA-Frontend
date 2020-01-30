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
    listParts: async (file: File, { uploadedId, key }: any) => await listParts(file),
    prepareUploadPart: async (file: File, partData: any) => await prepareUploadPart(file),
    abortMultipartUpload: async (file: File, { uploadedId, key }: any) => await abortMultipartUpload(file),
    completeMultipartUpload: async (file: File, { uploadedId, key, parts }: any) => await completeMultipartUpload(file),
  });
