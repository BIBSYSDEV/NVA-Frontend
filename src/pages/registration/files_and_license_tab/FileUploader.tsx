import { useEffect } from 'react';
import { File, emptyFile, Uppy } from '../../../types/file.types';
import { UppyDashboard } from '../../../components/UppyDashboard';

interface FileUploaderProps {
  addFile: (file: File) => void;
  uppy: Uppy;
}

export const FileUploader = ({ addFile, uppy }: FileUploaderProps) => {
  useEffect(() => {
    if (uppy && !uppy.hasUploadSuccessEventListener) {
      uppy.on('upload-success', (file, response) => {
        if (file && response.uploadURL) {
          const newFile: File = {
            ...emptyFile,
            identifier: response.uploadURL, // An ID from completeMultipartUpload endpoint
            name: file.name,
            mimeType: file.type ?? '',
            size: file.size,
          };
          addFile(newFile);
        }
      });
      // Avoid duplicating event listener
      uppy.hasUploadSuccessEventListener = true;
    }
  }, [addFile, uppy]);

  return uppy ? <UppyDashboard uppy={uppy} /> : null;
};
