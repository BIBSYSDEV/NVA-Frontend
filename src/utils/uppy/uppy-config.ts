import Uppy from '@uppy/core';
import AwsS3Multipart from '@uppy/aws-s3-multipart';
import norwegianLocale from '@uppy/locales/lib/nb_NO';
import englishLocale from '@uppy/locales/lib/en_US';
import {
  createMultipartUpload,
  listParts,
  prepareUploadPart,
  abortMultipartUpload,
  completeMultipartUpload,
} from '../../api/fileApi';
import i18n from '../../translations/i18n';
import { LanguageCodes } from '../../types/language.types';

const uppyLocale =
  i18n.language === LanguageCodes.NORWEGIAN_BOKMAL || i18n.language === LanguageCodes.NORWEGIAN_NYNORSK
    ? norwegianLocale
    : englishLocale;

export const createUppy =
  (shouldAllowMultipleFiles = true) =>
  () =>
    new Uppy({
      locale: uppyLocale,
      autoProceed: true,
      restrictions: { maxNumberOfFiles: shouldAllowMultipleFiles ? null : 1 },
    }).use(AwsS3Multipart, {
      abortMultipartUpload: async (file, opts) => await abortMultipartUpload(opts.uploadId, opts.key),
      completeMultipartUpload: async (file, opts) => await completeMultipartUpload(opts.uploadId, opts.key, opts.parts),
      createMultipartUpload: async (file) => await createMultipartUpload(file),
      listParts: async (file, opts) => await listParts(opts.uploadId, opts.key),
      prepareUploadParts: async (file, partData) =>
        await prepareUploadPart(partData.uploadId, partData.key, partData.partNumbers),
    });
