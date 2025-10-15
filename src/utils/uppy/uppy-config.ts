import AwsS3 from '@uppy/aws-s3';
import Uppy from '@uppy/core';
import englishLocale from '@uppy/locales/lib/en_US';
import norwegianLocale from '@uppy/locales/lib/nb_NO';
import {
  abortMultipartUpload,
  completeMultipartUpload,
  createMultipartUpload,
  listParts,
  signPart,
} from '../../api/fileApi';

const getUppyLocale = (language: string) => (language === 'nob' ? norwegianLocale : englishLocale);

export const createUppy = (language: string, registrationIdentifier: string) =>
  new Uppy({
    locale: getUppyLocale(language),
    autoProceed: true,
  }).use(AwsS3, {
    shouldUseMultipart: true,
    abortMultipartUpload: async (file, opts) =>
      await abortMultipartUpload(registrationIdentifier, opts.uploadId ?? '', opts.key),
    completeMultipartUpload: async (file, opts) =>
      await completeMultipartUpload(registrationIdentifier, opts.uploadId, opts.key, opts.parts),
    createMultipartUpload: async (file) => await createMultipartUpload(registrationIdentifier, file),
    listParts: async (file, opts) => await listParts(registrationIdentifier, opts.uploadId ?? '', opts.key),
    signPart: async (file, opts) =>
      await signPart(registrationIdentifier, opts.uploadId, opts.key, opts.partNumber, opts.body),
  });
