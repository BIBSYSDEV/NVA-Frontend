import React, { useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { AccordionActions, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloudUploadIcon from '@mui/icons-material/CloudUploadOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useUppy } from '@uppy/react';

import { RegistrationAccordion } from './RegistrationAccordion';
import { File, RegistrationFileSet } from '../../../types/file.types';
import { createRegistration } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import { ButtonWithProgress } from '../../../components/ButtonWithProgress';
import { FileUploader } from '../files_and_license_tab/FileUploader';
import { getRegistrationPath } from '../../../utils/urlPaths';
import { createUppy } from '../../../utils/uppy/uppy-config';
import { UploadedFileRow } from './UploadedFileRow';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';

const StyledRegistrationAccorion = styled(RegistrationAccordion)`
  border-color: ${({ theme }) => theme.palette.secondary.main};
`;

interface UploadRegistrationProps {
  expanded: boolean;
  onChange: (event: ChangeEvent<unknown>, isExpanded: boolean) => void;
}

export const UploadRegistration = ({ expanded, onChange }: UploadRegistrationProps) => {
  const { t } = useTranslation('registration');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const uppy = useUppy(createUppy());

  const createRegistrationWithFiles = async () => {
    setIsLoading(true);
    const registrationPayload: RegistrationFileSet = {
      fileSet: {
        type: 'FileSet',
        files: uploadedFiles,
      },
    };
    const createRegistrationResponse = await createRegistration(registrationPayload);
    if (isErrorStatus(createRegistrationResponse.status)) {
      dispatch(setNotification(t('feedback:error.create_registration'), NotificationVariant.Error));
      setIsLoading(false);
    } else if (isSuccessStatus(createRegistrationResponse.status)) {
      history.push(getRegistrationPath(createRegistrationResponse.data.identifier), { highestValidatedTab: -1 });
    }
  };

  return (
    <StyledRegistrationAccorion expanded={expanded} onChange={onChange}>
      <AccordionSummary
        data-testid={dataTestId.registrationWizard.new.fileAccordion}
        expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <CloudUploadIcon />
        <div>
          <Typography variant="h2">{t('registration.start_with_uploading_file_title')}</Typography>
          <Typography>{t('registration.start_with_uploading_file_description')}</Typography>
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
          data-testid={dataTestId.registrationWizard.new.startRegistrationButton}
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
