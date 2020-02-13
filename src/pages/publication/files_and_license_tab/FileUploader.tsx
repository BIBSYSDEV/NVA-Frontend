import React, { useEffect, useCallback } from 'react';
import { File, emptyFile, Uppy } from '../../../types/file.types';
import UppyDashboard from '../../../components/UppyDashboard';

interface FileUploaderProps {
  addFile: (file: File) => void;
  uppy: Uppy;
}

let hasUploadedFiles = false;

const FileUploader: React.FC<FileUploaderProps> = ({ addFile, uppy }) => {
  const addFileCallback = useCallback(
    (file: File) => {
      addFile({
        ...emptyFile,
        ...file,
      });
    },
    [addFile]
  );

  useEffect(() => {
    if (uppy && !uppy.hasUploadSuccessEventListener) {
      uppy.on('upload-success', (file: File) => {
        addFileCallback(file);
      });
      // Avoid duplicating event listener
      uppy.hasUploadSuccessEventListener = true;
    }
  }, [addFile, uppy, addFileCallback]);

  useEffect(() => {
    // Handle previously uploaded files from creation of a new publication
    if (!hasUploadedFiles) {
      Object.values(uppy.getState().files).forEach((file: File) => {
        addFileCallback(file);
      });
      hasUploadedFiles = true;
    }
  }, [uppy, addFileCallback]);

  return uppy ? <UppyDashboard uppy={uppy} /> : null;
};

export default FileUploader;
