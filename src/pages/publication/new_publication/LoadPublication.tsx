import React, { useEffect, useState, FC } from 'react';
import { useTranslation } from 'react-i18next';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import PublicationExpansionPanel from './PublicationExpansionPanel';
import UppyDashboard from '../../../components/UppyDashboard';
import { File, Uppy, emptyFile } from '../../../types/file.types';
import FileCard from '../files_and_license_tab/FileCard';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { UppyFile } from '@uppy/core';
import { createPublication } from '../../../api/publicationApi';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import Progress from '../../../components/Progress';

const StyledProgressContainer = styled.div`
  padding-left: 1rem;
  display: flex;
  align-items: center;
`;

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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (uppy && !uppy.hasUploadSuccessEventListener) {
      const addFile = (newFile: File) => {
        setUploadedFiles([newFile, ...uploadedFiles]);
      };

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
      uppy.hasUploadSuccessEventListener = true;

      return () => {
        uppy.off('upload-success', addFile);
        uppy.hasUploadSuccessEventListener = false;
      };
    }
  }, [uppy, uploadedFiles]);

  const createEmptyPublication = async () => {
    setIsLoading(true);
    const publication = await createPublication();
    if (publication?.identifier) {
      openForm();
      history.push(`/publication/${publication.identifier}`);
    } else {
      dispatch(setNotification(t('feedback:error.create_publication'), NotificationVariant.Error));
    }
  };

  return (
    <PublicationExpansionPanel
      dataTestId="new-publication-file"
      headerLabel={t('publication:publication.load_file')}
      icon={<CloudDownloadIcon />}
      expanded={expanded}
      onChange={onChange}
      ariaControls="publication-method-file">
      {uppy ? (
        <>
          <UppyDashboard uppy={uppy} shouldAllowMultipleFiles={shouldAllowMultipleFiles} />
          {uploadedFiles.map((file) => (
            <StyledFileCard key={file.identifier}>
              <FileCard
                file={{
                  ...emptyFile,
                  identifier: file.identifier,
                  name: file.name,
                  size: file.size,
                }}
                removeFile={() => {
                  setUploadedFiles(uploadedFiles.filter((uploadedFile) => uploadedFile.identifier !== file.identifier));
                  uppy.removeFile(file.identifier);
                }}
              />
            </StyledFileCard>
          ))}
          {uploadedFiles.length > 0 && (
            <Button
              color="primary"
              data-testid="publication-file-start-button"
              variant="contained"
              onClick={createEmptyPublication}
              disabled={isLoading}>
              {t('common:start')}
              {isLoading && (
                <StyledProgressContainer>
                  <Progress size={15} thickness={5} />
                </StyledProgressContainer>
              )}
            </Button>
          )}
        </>
      ) : null}
    </PublicationExpansionPanel>
  );
};

export default LoadPublication;
