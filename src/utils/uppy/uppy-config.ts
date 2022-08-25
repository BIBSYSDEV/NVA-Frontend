import Uppy from '@uppy/core';
import AwsS3Multipart from '@uppy/aws-s3-multipart';
import norwegianLocale from '@uppy/locales/lib/nb_NO';
import englishLocale from '@uppy/locales/lib/en_US';
import { FileApiPath } from '../../api/apiPaths';
import { authenticatedApiRequest } from '../../api/apiRequest';
import {
  AbortMultipartUpload,
  CompleteMultipartUploadResponse,
  CreateMultipartUploadResponse,
  ListPartsResponse,
  PrepareUploadPartsResponse,
} from '../../types/file.types';

export const createUppy = (language: string) => () =>
  new Uppy({
    locale: language === 'nob' ? norwegianLocale : englishLocale,
    autoProceed: true,
  }).use(AwsS3Multipart, {
    abortMultipartUpload: async (file, opts) => {
      const abortResponse = await authenticatedApiRequest<AbortMultipartUpload>({
        url: FileApiPath.Abort,
        method: 'POST',
        data: opts,
      });
      return abortResponse.data;
    },
    completeMultipartUpload: async (file, opts) => {
      const completeResponse = await authenticatedApiRequest<CompleteMultipartUploadResponse>({
        url: FileApiPath.Complete,
        method: 'POST',
        data: opts,
      });
      return completeResponse.data;
    },
    createMultipartUpload: async (file) => {
      const createResponse = await authenticatedApiRequest<CreateMultipartUploadResponse>({
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
      const listPartsResponse = await authenticatedApiRequest<ListPartsResponse>({
        url: FileApiPath.ListParts,
        method: 'POST',
        data: opts,
      });
      return listPartsResponse.data;
    },
    prepareUploadParts: async (file, partData) => {
      const prepareResponse = await authenticatedApiRequest<PrepareUploadPartsResponse>({
        url: FileApiPath.Prepare,
        method: 'POST',
        data: partData,
      });
      return prepareResponse.data;
    },
  });
