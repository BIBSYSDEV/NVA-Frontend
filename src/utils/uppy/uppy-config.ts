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

export const createUppy = (language: string) =>
  new Uppy({
    locale: getUppyLocale(language),
    autoProceed: true,
  }).use(AwsS3, {
    shouldUseMultipart: true,
    abortMultipartUpload: async (file, opts) => await abortMultipartUpload(opts.uploadId ?? '', opts.key),
    completeMultipartUpload: async (file, opts) => await completeMultipartUpload(opts.uploadId, opts.key, opts.parts),
    createMultipartUpload: async (file) => await createMultipartUpload(file),
    listParts: async (file, opts) => await listParts(opts.uploadId ?? '', opts.key),
    signPart: async (file, opts) => await signPart(opts.uploadId, opts.key, opts.partNumber, opts.body),
  });
