import React, { useEffect, useState, FC } from 'react';
import { useTranslation } from 'react-i18next';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import styled from 'styled-components';
import { UppyFile } from '@uppy/core';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import PublicationExpansionPanel from './PublicationExpansionPanel';
import UppyDashboard from '../../../components/UppyDashboard';
import { File, emptyFile } from '../../../types/file.types';
import FileCard from '../files_and_license_tab/FileCard';
import { createPublication } from '../../../api/publicationApi';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import ButtonWithProgress from '../../../components/ButtonWithProgress';
import { BackendTypeNames } from '../../../types/publication.types';
import useUppy from '../../../utils/hooks/useUppy';

const StyledFileCard = styled.div`
  margin-top: 1rem;
`;

interface LoadPublicationProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  openForm: () => void;
}

const LoadPublication: FC<LoadPublicationProps> = ({ expanded, onChange, openForm }) => {
  const { t } = useTranslation('publication');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const uppy = useUppy();

  useEffect(() => {
    if (uppy) {
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

  const createPublicationWithFiles = async () => {
    setIsLoading(true);
    const publicationPayload = {
      fileSet: {
        type: BackendTypeNames.FILE_SET,
        files: uploadedFiles,
      },
    };
    const publication = await createPublication(publicationPayload);
    if (publication?.identifier) {
      openForm();
      history.push(`/publication/${publication.identifier}`);
    } else {
      setIsLoading(false);
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
          <UppyDashboard uppy={uppy} />
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
            <ButtonWithProgress
              data-testid="publication-file-start-button"
              isLoading={isLoading}
              onClick={createPublicationWithFiles}>
              {t('common:start')}
            </ButtonWithProgress>
          )}
        </>
      ) : null}
    </PublicationExpansionPanel>
  );
};

export default LoadPublication;
