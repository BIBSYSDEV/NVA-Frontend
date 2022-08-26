import {
  CreateMultipartUploadResponse,
  PrepareUploadPartsResponse,
  CompleteMultipartUploadResponse,
} from '../../types/file.types';

export const mockFileUploadUrl = 'http://localhost:3000/api/file-upload/';
export const mockCreateUpload: CreateMultipartUploadResponse = { uploadId: 'upoadId', key: 'key' };
export const mockPrepareUpload: PrepareUploadPartsResponse = {
  presignedUrls: {
    '1': mockFileUploadUrl,
  },
};
export const mockCompleteUpload: CompleteMultipartUploadResponse = { location: '123-123-123' };
export const mockDownload = { presignedDownloadUrl: 'http://localhost:3000/api/file-download/' };
