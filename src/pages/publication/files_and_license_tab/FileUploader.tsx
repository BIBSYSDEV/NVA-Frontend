import React, { useEffect, FC } from 'react';
import { File, emptyFile, Uppy } from '../../../types/file.types';
import UppyDashboard from '../../../components/UppyDashboard';
import { UppyFile } from '@uppy/core';

interface FileUploaderProps {
  addFile: (file: File) => void;
  shouldAllowMultipleFiles: boolean;
  uppy: Uppy;
}

const FileUploader: FC<FileUploaderProps> = ({ addFile, shouldAllowMultipleFiles, uppy }) => {
  useEffect(() => {
    if (uppy && !uppy.hasUploadSuccessEventListener) {
      uppy.on('upload-success', (file: UppyFile, response: any) => {
        const newFile = {
          ...emptyFile,
          identifier: response.uploadURL, // In reality an ID from completeMultipartUpload endpoint
          name: file.name,
          mimeType: file.type ?? '',
          size: file.size,
        };
        addFile(newFile);
      });
      // Avoid duplicating event listener
      uppy.hasUploadSuccessEventListener = true;
    }
  }, [addFile, uppy]);

  return uppy ? <UppyDashboard uppy={uppy} shouldAllowMultipleFiles={shouldAllowMultipleFiles} /> : null;
};

export default FileUploader;
