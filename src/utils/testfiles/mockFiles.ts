import {
  CreateMultipartUploadResponse,
  PrepareUploadPartsResponse,
  CompleteMultipartUploadResponse,
} from '../../types/file.types';

export const mockFileUploadUrl = 'http://localhost:3000/api/file-upload/';
export const mockCreateUpload: CreateMultipartUploadResponse = { uploadId: 'upoadId', key: 'key' };
export const mockPrepareUpload: PrepareUploadPartsResponse = {
  presignedUrls: {
    '1': 'https://bucket.region.amazonaws.com/path/to/file.jpg?partNumber=1',
    '2': 'https://bucket.region.amazonaws.com/path/to/file.jpg?partNumber=2',
    '3': 'https://bucket.region.amazonaws.com/path/to/file.jpg?partNumber=3',
  },
};
export const mockCompleteUpload: CompleteMultipartUploadResponse = { location: '123-123-123' };
export const mockDownload = { presignedDownloadUrl: 'http://localhost:3000/api/file-download/' };
