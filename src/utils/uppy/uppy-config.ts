import Uppy from '@uppy/core';
import AwsS3Multipart from '@uppy/aws-s3-multipart';
import norwegianLocale from '@uppy/locales/lib/nb_NO';
import englishLocale from '@uppy/locales/lib/en_US';
import i18n from '../../translations/i18n';
import { LanguageCodes } from '../../types/language.types';
import { FileApiPath } from '../../api/apiPaths';
import { authenticatedApiRequest } from '../../api/apiRequest';

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
