import React, { useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { AccordionActions, Typography } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useUppy } from '@uppy/react';

import RegistrationAccordion from './RegistrationAccordion';
import { File, emptyFile } from '../../../types/file.types';
import FileCard from '../files_and_license_tab/FileCard';
import { createRegistration } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import ButtonWithProgress from '../../../components/ButtonWithProgress';
import FileUploader from '../files_and_license_tab/FileUploader';
import { BackendTypeNames } from '../../../types/publication_types/commonRegistration.types';
import { getRegistrationPath } from '../../../utils/urlPaths';
import { createUppy } from '../../../utils/uppy/uppy-config';
import RegistrationAccordionDetails from './RegistrationAccordionDetails';
import { RegistrationAccordionSummary } from './RegistrationAccordionSummary';

const StyledFileCard = styled.div`
  margin-top: 1rem;
`;

const StyledRegistrationAccorion = styled(RegistrationAccordion)`
  border-color: ${({ theme }) => theme.palette.secondary.main};
`;

interface UploadRegistrationProps {
  expanded: boolean;
  onChange: (event: ChangeEvent<unknown>, isExpanded: boolean) => void;
}

const UploadRegistration = ({ expanded, onChange }: UploadRegistrationProps) => {
  const { t } = useTranslation('registration');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const uppy = useUppy(createUppy());

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
      history.push(getRegistrationPath(registration.identifier), { isNewRegistration: true });
    } else {
      setIsLoading(false);
      dispatch(setNotification(t('feedback:error.create_registration'), NotificationVariant.Error));
    }
  };

  return (
    <StyledRegistrationAccorion expanded={expanded} onChange={onChange}>
      <RegistrationAccordionSummary
        title={t('registration:registration.start_with_uploading_file_title')}
        description={t('registration:registration.start_with_uploading_file_description')}
        icon={<CloudUploadIcon />}
        ariaControls="registration-method-file"
        dataTestId="new-registration-file"
      />

      <RegistrationAccordionDetails>
        {uppy && (
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
                    const fileId = uppy.getFiles().find((thisFile) => thisFile.response?.uploadURL === file.identifier)
                      ?.id;
                    fileId && uppy.removeFile(fileId);
                    setUploadedFiles(
                      uploadedFiles.filter((uploadedFile) => uploadedFile.identifier !== file.identifier)
                    );
                  }}
                />
              </StyledFileCard>
            ))}
          </>
        )}
      </RegistrationAccordionDetails>
      <AccordionActions>
        <ButtonWithProgress
          data-testid="registration-file-start-button"
          endIcon={<ArrowForwardIcon fontSize="large" />}
          color="secondary"
          variant="contained"
          isLoading={isLoading}
          disabled={uploadedFiles.length === 0}
          onClick={createRegistrationWithFiles}>
          <Typography variant="button">{t('registration.start_registration')}</Typography>
        </ButtonWithProgress>
      </AccordionActions>
    </StyledRegistrationAccorion>
  );
};

export default UploadRegistration;
