import React, { useEffect, useState, FC } from 'react';
import { useTranslation } from 'react-i18next';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import PublicationExpansionPanel from './PublicationExpansionPanel';
import UppyDashboard from '../../../components/UppyDashboard';
import { Uppy, emptyFile } from '../../../types/file.types';
import FileCard from '../files_and_license_tab/FileCard';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { UppyFile } from '@uppy/core';

const shouldAllowMultipleFiles = true;

interface LoadPublicationProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  openForm: () => void;
  uppy: Uppy;
}

const StyledFileCard = styled.div`
  margin-top: 1rem;
`;

const LoadPublication: FC<LoadPublicationProps> = ({ expanded, onChange, openForm, uppy }) => {
  const { t } = useTranslation('publication');
  const [uploadedFiles, setUploadedFiles] = useState<UppyFile[]>([]);

  useEffect(() => {
    if (uppy && !uppy.hasUploadSuccessEventListener) {
      const addFile = (newFile: UppyFile) => {
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
          {uploadedFiles.map((file) => (
            <StyledFileCard key={file.id}>
              <FileCard
                file={{ ...emptyFile, identifier: file.id, name: file.name, size: file.size }}
                removeFile={() => {
                  setUploadedFiles(uploadedFiles.filter((uploadedFile) => uploadedFile.id !== file.id));
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
