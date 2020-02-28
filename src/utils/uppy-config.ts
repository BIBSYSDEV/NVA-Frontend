import Uppy, { UppyFile } from '@uppy/core';
import AwsS3Multipart, { AwsS3Part } from '@uppy/aws-s3-multipart';
import {
  createMultipartUpload,
  listParts,
  prepareUploadPart,
  abortMultipartUpload,
  completeMultipartUpload,
} from '../api/fileUploadApi';
import { Uppy as UppyType } from '../types/file.types';

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
    abortMultipartUpload: async (_: UppyFile, { uploadId, key }: UppyArgs) => await abortMultipartUpload(uploadId, key),
    completeMultipartUpload: async (_: UppyFile, { uploadId, key, parts }: UppyCompleteArgs) =>
      await completeMultipartUpload(uploadId, key, parts),
    createMultipartUpload: async (file: UppyFile) => await createMultipartUpload(file),
    listParts: async (_: UppyFile, { uploadId, key }: UppyArgs) => await listParts(uploadId, key),
    prepareUploadPart: async (_: UppyFile, { uploadId, key, body, number }: UppyPrepareArgs) =>
      await prepareUploadPart(uploadId, key, body, number),
  });
