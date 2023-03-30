import Uppy, { UppyFile } from '@uppy/core';
import AwsS3Multipart, { AwsS3Part } from '@uppy/aws-s3-multipart';
import norwegianLocale from '@uppy/locales/lib/nb_NO';
import englishLocale from '@uppy/locales/lib/en_US';
import {
  createMultipartUpload,
  listParts,
  abortMultipartUpload,
  completeMultipartUpload,
  prepareUploadPart,
} from '../../api/fileApi';

interface UppyArgs {
  uploadId: string;
  key: string;
}

interface UppyCompleteArgs extends UppyArgs {
  parts: AwsS3Part[];
}

const getUppyLocale = (language: string) => (language === 'nob' ? norwegianLocale : englishLocale);

export const createUppy = (language: string) => () =>
  new Uppy({
    locale: getUppyLocale(language),
    autoProceed: true,
  }).use(AwsS3Multipart, {
    abortMultipartUpload: async (_: UppyFile, { uploadId, key }: UppyArgs) => await abortMultipartUpload(uploadId, key),
    completeMultipartUpload: async (_: UppyFile, { uploadId, key, parts }: UppyCompleteArgs) =>
      await completeMultipartUpload(uploadId, key, parts),
    createMultipartUpload: async (file: UppyFile) => await createMultipartUpload(file),
    listParts: async (_: UppyFile, { uploadId, key }: UppyArgs) => await listParts(uploadId, key),
    signPart: async (file, { uploadId, key, partNumber, signal }) =>
      await prepareUploadPart(uploadId, key, partNumber, signal),
  });
