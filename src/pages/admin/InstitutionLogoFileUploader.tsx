import React, { useEffect } from 'react';
import { Uppy } from '../../types/file.types';
import UppyDashboard from '../../components/UppyDashboard';

interface InstitutionLogoFileUploaderProps {
  setFile: (file: File) => void;
  uppy: Uppy;
}

const InstitutionLogoFileUploader: React.FC<InstitutionLogoFileUploaderProps> = ({ setFile, uppy }) => {
  useEffect(() => {
    if (uppy && !uppy.hasUploadSuccessEventListener) {
      uppy.on('upload-success', (file: File) => setFile(file));

      // Avoid duplicating event listener
      uppy.hasUploadSuccessEventListener = true;
    }
  }, [setFile, uppy]);

  return uppy ? <UppyDashboard uppy={uppy} /> : null;
};

export default InstitutionLogoFileUploader;
