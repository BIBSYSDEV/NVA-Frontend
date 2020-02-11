import React, { useEffect } from 'react';
import { File, UppyFileResponse, emptyFile } from '../../../types/file.types';
import UppyDashboard from '../../../components/UppyDashboard';

interface FileUploaderProps {
  addFile: (file: File) => void;
  uppy: any;
}

const FileUploader: React.FC<FileUploaderProps> = ({ addFile, uppy }) => {
  useEffect(() => {
    if (uppy && !uppy.hasUploadSuccessEventListener) {
      uppy.on('upload-success', (file: File, response: UppyFileResponse) => {
        addFile({
          ...emptyFile,
          ...file,
        });
      });
      // Avoid duplicating event listener
      uppy.hasUploadSuccessEventListener = true;
    }
  }, [addFile, uppy]);

  return uppy ? <UppyDashboard uppy={uppy} /> : null;
};

export default FileUploader;
