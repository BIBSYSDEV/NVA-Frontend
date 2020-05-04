import React, { useEffect, useState, FC } from 'react';
import { useTranslation } from 'react-i18next';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import PublicationExpansionPanel from './PublicationExpansionPanel';
import UppyDashboard from '../../../components/UppyDashboard';
import { File, Uppy, emptyFile, emptyFileSet } from '../../../types/file.types';
import FileCard from '../files_and_license_tab/FileCard';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { UppyFile } from '@uppy/core';
import { emptyPublication } from '../../../types/publication.types';
import { createPublication } from '../../../api/publicationApi';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';

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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (uppy && !uppy.hasUploadSuccessEventListener) {
      const addFile = (newFile: File) => {
        setUploadedFile(newFile);
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
  }, [uppy, uploadedFile]);

  const createEmptyPublication = async () => {
    console.log('create');
    if (uploadedFile) {
      console.log('uploadedFile', uploadedFile);
      const emptyPublicationWithFiles = {
        ...emptyPublication,
        fileSet: {
          ...emptyFileSet,
          files: [uploadedFile],
        },
      };
      const publication = await createPublication(emptyPublication);
      if (publication?.identifier) {
        openForm();
        history.push(`/publication/${publication.identifier}`);
      } else {
        dispatch(setNotification(t('feedback:error.create_publication'), NotificationVariant.Error));
      }
    }
  };

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
          {uploadedFile && (
            <>
              <StyledFileCard key={uploadedFile.identifier}>
                <FileCard
                  file={{
                    ...emptyFile,
                    identifier: uploadedFile.identifier,
                    name: uploadedFile.name,
                    size: uploadedFile.size,
                  }}
                  removeFile={() => {
                    setUploadedFile(null);
                    uppy.removeFile(uploadedFile.identifier);
                  }}
                />
              </StyledFileCard>

              <Button color="primary" variant="contained" onClick={createEmptyPublication}>
                {t('common:start')}
              </Button>
            </>
          )}
        </>
      ) : null}
    </PublicationExpansionPanel>
  );
};

export default LoadPublication;
