import React, { useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { AccordionActions, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useUppy } from '@uppy/react';

import RegistrationAccordion from './RegistrationAccordion';
import { File } from '../../../types/file.types';
import { createRegistration } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import ButtonWithProgress from '../../../components/ButtonWithProgress';
import FileUploader from '../files_and_license_tab/FileUploader';
import { BackendTypeNames } from '../../../types/publication_types/commonRegistration.types';
import { getRegistrationPath } from '../../../utils/urlPaths';
import { createUppy } from '../../../utils/uppy/uppy-config';
import UploadedFileRow from './UploadedFileRow';

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
      history.push(getRegistrationPath(registration.identifier), { highestValidatedTab: -1 });
    } else {
      setIsLoading(false);
      dispatch(setNotification(t('feedback:error.create_registration'), NotificationVariant.Error));
    }
  };

  return (
    <StyledRegistrationAccorion expanded={expanded} onChange={onChange}>
      <AccordionSummary data-testid="new-registration-file" expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <CloudUploadIcon />
        <div>
          <Typography variant="h2">{t('registration:registration.start_with_uploading_file_title')}</Typography>
          <Typography>{t('registration:registration.start_with_uploading_file_description')}</Typography>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        {uppy && (
          <>
            <FileUploader uppy={uppy} addFile={(newFile: File) => setUploadedFiles((files) => [newFile, ...files])} />
            {uploadedFiles.length > 0 && (
              <>
                <Typography variant="subtitle1">{t('files_and_license.files')}:</Typography>
                {uploadedFiles.map((file) => (
                  <UploadedFileRow
                    key={file.identifier}
                    file={file}
                    removeFile={() => {
                      const uppyFiles = uppy.getFiles();
                      const uppyId = uppyFiles.find((uppyFile) => uppyFile.response?.uploadURL === file.identifier)?.id;
                      uppyId && uppy.removeFile(uppyId);
                      setUploadedFiles(
                        uploadedFiles.filter((uploadedFile) => uploadedFile.identifier !== file.identifier)
                      );
                    }}
                  />
                ))}
              </>
            )}
          </>
        )}
      </AccordionDetails>

      <AccordionActions>
        <ButtonWithProgress
          data-testid="registration-file-start-button"
          endIcon={<ArrowForwardIcon fontSize="large" />}
          color="secondary"
          variant="contained"
          isLoading={isLoading}
          disabled={uploadedFiles.length === 0}
          onClick={createRegistrationWithFiles}>
          {t('registration.start_registration')}
        </ButtonWithProgress>
      </AccordionActions>
    </StyledRegistrationAccorion>
  );
};

export default UploadRegistration;
