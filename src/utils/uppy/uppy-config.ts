import Uppy, { UppyFile } from '@uppy/core';
import AwsS3Multipart, { AwsS3Part } from '@uppy/aws-s3-multipart';
import norwegianLocale from '@uppy/locales/lib/nb_NO';
import englishLocale from '@uppy/locales/lib/en_US';
import {
  createMultipartUpload,
  listParts,
  prepareUploadPart,
  abortMultipartUpload,
  completeMultipartUpload,
} from '../../api/fileApi';
import { LanguageCodes } from '../../types/language.types';

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

const getUppyLocale = (language: string) =>
  language === LanguageCodes.NORWEGIAN_BOKMAL || language === LanguageCodes.NORWEGIAN_NYNORSK
    ? norwegianLocale
    : englishLocale;

export const createUppy = (language: string) => {
  console.log('create uppy');
  return () => {
    console.log('heia');
    return Uppy<Uppy.StrictTypes>({
      locale: getUppyLocale(language),
      autoProceed: true,
    }).use(AwsS3Multipart, {
      abortMultipartUpload: async (_: UppyFile, { uploadId, key }: UppyArgs) =>
        await abortMultipartUpload(uploadId, key),
      completeMultipartUpload: async (_: UppyFile, { uploadId, key, parts }: UppyCompleteArgs) =>
        await completeMultipartUpload(uploadId, key, parts),
      createMultipartUpload: async (file: UppyFile) => await createMultipartUpload(file),
      listParts: async (_: UppyFile, { uploadId, key }: UppyArgs) => await listParts(uploadId, key),
      prepareUploadPart: async (_: UppyFile, { uploadId, key, body, number }: UppyPrepareArgs) =>
        await prepareUploadPart(uploadId, key, body, number),
    });
  };
};
