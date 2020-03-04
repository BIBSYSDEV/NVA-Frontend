import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import PublicationExpansionPanel from './PublicationExpansionPanel';
import UppyDashboard from '../../../components/UppyDashboard';
import { Uppy, File } from '../../../types/file.types';
import FileCard from '../files_and_license_tab/FileCard';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

interface LoadPublicationProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  uppy: Uppy;
  openForm: () => void;
}

const StyledFileCard = styled.div`
  margin-top: 1rem;
`;

const LoadPublication: React.FC<LoadPublicationProps> = ({ expanded, onChange, uppy, openForm }) => {
  const { t } = useTranslation('publication');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const shouldAllowMultipleFiles = true;

  useEffect(() => {
    if (uppy && !uppy.hasUploadSuccessEventListener) {
      const addFile = (newFile: File) => {
        setUploadedFiles([newFile, ...uploadedFiles]);
      };

      uppy.on('upload-success', addFile);
      uppy.hasUploadSuccessEventListener = true;

      return () => {
        uppy.off('upload-success', addFile);
        uppy.hasUploadSuccessEventListener = false;
      };
    }
  }, [uppy, uploadedFiles]);

  return (
    <PublicationExpansionPanel
      headerLabel={t('publication:publication.load_file')}
      icon={<CloudDownloadIcon />}
      expanded={expanded}
      onChange={onChange}
      ariaControls="publication-method-file">
      {uppy ? (
        <>
          <UppyDashboard uppy={uppy} shouldAllowMultipleFiles={shouldAllowMultipleFiles} />
          {uploadedFiles.map(file => (
            <StyledFileCard key={file.id}>
              <FileCard
                file={file}
                removeFile={() => {
                  setUploadedFiles(uploadedFiles.filter(uploadedFile => uploadedFile.id !== file.id));
                  uppy.removeFile(file.id);
                }}
              />
            </StyledFileCard>
          ))}
          {uploadedFiles.length > 0 && (
            <Button color="primary" variant="contained" onClick={openForm}>
              {t('common:start')}
            </Button>
          )}
        </>
      ) : null}
    </PublicationExpansionPanel>
  );
};

export default LoadPublication;
