import React, { useEffect } from 'react';
import { File, emptyFile, Uppy } from '../../../types/file.types';
import UppyDashboard from '../../../components/UppyDashboard';
import { UppyFile } from '@uppy/core';

interface FileUploaderProps {
  addFile: (file: File) => void;
  uppy: Uppy;
  shouldAllowMultipleFiles: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ addFile, uppy, shouldAllowMultipleFiles }) => {
  useEffect(() => {
    if (uppy && !uppy.hasUploadSuccessEventListener) {
      uppy.on('upload-success', (file: UppyFile) => {
        addFile({
          ...emptyFile,
          identifier: file.id,
          name: file.name,
          mimeType: file.type ?? '',
          size: file.size,
        });
      });
      // Avoid duplicating event listener
      uppy.hasUploadSuccessEventListener = true;
    }
  }, [addFile, uppy]);

  return uppy ? <UppyDashboard uppy={uppy} shouldAllowMultipleFiles={shouldAllowMultipleFiles} /> : null;
};

export default FileUploader;
