<<<<<<< HEAD
import Uppy from '@uppy/core';
import AwsS3Multipart from '@uppy/aws-s3-multipart';
import norwegianLocale from '@uppy/locales/lib/nb_NO';
import englishLocale from '@uppy/locales/lib/en_US';
import i18n from '../../translations/i18n';
import { LanguageCodes } from '../../types/language.types';
import { FileApiPath } from '../../api/apiPaths';
import { authenticatedApiRequest } from '../../api/apiRequest';
=======
import Uppy, { StrictTypes, UppyFile } from '@uppy/core';
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
>>>>>>> aa38c16b57f6e49d9ec076fc12a6068a27d4e076

const getUppyLocale = (language: string) => (language === 'nob' ? norwegianLocale : englishLocale);

<<<<<<< HEAD
export const createUppy =
  (shouldAllowMultipleFiles = true) =>
  () =>
    new Uppy({
      locale: uppyLocale,
      autoProceed: true,
      restrictions: { maxNumberOfFiles: shouldAllowMultipleFiles ? null : 1 },
    }).use(AwsS3Multipart, {
      abortMultipartUpload: async (file, opts) => {
        const abortResponse = await authenticatedApiRequest<any>({
          url: FileApiPath.Abort,
          method: 'POST',
          data: opts,
        });
        return abortResponse.data;
      },
      completeMultipartUpload: async (file, opts) => {
        const completeResponse = await authenticatedApiRequest<any>({
          url: FileApiPath.Complete,
          method: 'POST',
          data: opts,
        });
        return completeResponse.data;
      },
      createMultipartUpload: async (file) => {
        const createResponse = await authenticatedApiRequest<any>({
          url: FileApiPath.Create,
          method: 'POST',
          data: {
            // TODO: Use whole file as data?
            filename: file.name,
            size: file.data.size,
            lastmodified: (file.data as File).lastModified,
            mimetype: file.data.type,
          },
        });
        return createResponse.data;
      },
      listParts: async (file, opts) => {
        const listPartsResponse = await authenticatedApiRequest<any>({
          url: FileApiPath.ListParts,
          method: 'POST',
          data: opts,
        });
        return listPartsResponse.data;
      },
      prepareUploadParts: async (file, partData) => {
        const prepareResponse = await authenticatedApiRequest<any>({
          url: FileApiPath.Prepare,
          method: 'POST',
          data: partData,
        });
        return prepareResponse.data;
      },
    });
=======
export const createUppy = (language: string) => () =>
  Uppy<StrictTypes>({
    locale: getUppyLocale(language),
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
>>>>>>> aa38c16b57f6e49d9ec076fc12a6068a27d4e076
