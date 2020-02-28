import Uppy from '@uppy/core';
import AwsS3Multipart, { AwsS3Part } from '@uppy/aws-s3-multipart';
import {
  createMultipartUpload,
  listParts,
  prepareUploadPart,
  abortMultipartUpload,
  completeMultipartUpload,
} from '../api/fileUploadApi';
import { File, Uppy as UppyType } from '../types/file.types';

interface UppyArgs {
  uploadId: string;
  key: string;
}

interface UppyPrepareArgs extends UppyArgs {
  body: Blob;
  number: number;
}

interface UppyCompleteArgs extends UppyArgs {
  parts: AwsS3Part[];
}

export interface UppyCompletePart {
  PartNumber: string;
  ETag: string;
}

export const createUppy = (): UppyType =>
  Uppy<Uppy.StrictTypes>({
    autoProceed: true,
  }).use(AwsS3Multipart, {
    abortMultipartUpload: async (_: File, { uploadId, key }: UppyArgs) => await abortMultipartUpload(uploadId, key),
    completeMultipartUpload: async (_: File, { uploadId, key, parts }: UppyCompleteArgs) =>
      await completeMultipartUpload(uploadId, key, parts),
    createMultipartUpload: async (file: File) => await createMultipartUpload(file),
    listParts: async (_: File, { uploadId, key }: UppyArgs) => await listParts(uploadId, key),
    prepareUploadPart: async (_: File, { uploadId, key, body, number }: UppyPrepareArgs) =>
      await prepareUploadPart(uploadId, key, body, number),
  });
