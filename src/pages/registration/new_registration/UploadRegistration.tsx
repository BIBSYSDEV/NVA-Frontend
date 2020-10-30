import React, { useState, FC } from 'react';
import { useTranslation } from 'react-i18next';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import RegistrationAccordion from './RegistrationAccordion';
import { File, emptyFile } from '../../../types/file.types';
import FileCard from '../files_and_license_tab/FileCard';
import { createRegistration } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import ButtonWithProgress from '../../../components/ButtonWithProgress';
import useUppy from '../../../utils/hooks/useUppy';
import FileUploader from '../files_and_license_tab/FileUploader';
import { BackendTypeNames } from '../../../types/publication_types/commonRegistration.types';

const StyledFileCard = styled.div`
  margin-top: 1rem;
`;

interface UploadRegistrationProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  openForm: () => void;
}

const UploadRegistration: FC<UploadRegistrationProps> = ({ expanded, onChange, openForm }) => {
  const { t } = useTranslation('registration');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const uppy = useUppy();

  const createRegistrationWithFiles = async () => {
    setIsLoading(true);
    const registrationPayload = {
      fileSet: {
        type: BackendTypeNames.FILE_SET,
        files: uploadedFiles,
      },
    };
    const registration = await createRegistration(registrationPayload);
    if (registration?.identifier) {
      openForm();
      history.push(`/registration/${registration.identifier}`);
    } else {
      setIsLoading(false);
      dispatch(setNotification(t('feedback:error.create_registration'), NotificationVariant.Error));
    }
  };

  return (
    <RegistrationAccordion
      dataTestId="new-registration-file"
      headerLabel={t('registration:registration.start_with_uploading_file')}
      icon={<CloudDownloadIcon />}
      expanded={expanded}
      onChange={onChange}
      ariaControls="registration-method-file">
      {uppy ? (
        <>
          <FileUploader uppy={uppy} addFile={(newFile: File) => setUploadedFiles((files) => [newFile, ...files])} />
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
              data-testid="registration-file-start-button"
              isLoading={isLoading}
              onClick={createRegistrationWithFiles}>
              {t('common:start')}
            </ButtonWithProgress>
          )}
        </>
      ) : null}
    </RegistrationAccordion>
  );
};

export default UploadRegistration;
