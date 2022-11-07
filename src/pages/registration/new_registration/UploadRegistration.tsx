import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccordionActions, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloudUploadIcon from '@mui/icons-material/CloudUploadOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useUppy } from '@uppy/react';
import { LoadingButton } from '@mui/lab';
import { RegistrationAccordion } from './RegistrationAccordion';
import { AssociatedFile } from '../../../types/file.types';
import { createRegistration } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/notificationSlice';
import { FileUploader } from '../files_and_license_tab/FileUploader';
import { getRegistrationPath } from '../../../utils/urlPaths';
import { createUppy } from '../../../utils/uppy/uppy-config';
import { UploadedFileRow } from './UploadedFileRow';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { StartRegistrationAccordionProps } from './LinkRegistration';
import { BaseRegistration } from '../../../types/registration.types';

export const UploadRegistration = ({ expanded, onChange }: StartRegistrationAccordionProps) => {
  const { t, i18n } = useTranslation();
  const [uploadedFiles, setUploadedFiles] = useState<AssociatedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const uppy = useUppy(createUppy(i18n.language));

  const createRegistrationWithFiles = async () => {
    setIsLoading(true);
    const registrationPayload: Partial<BaseRegistration> = {
      associatedArtifacts: uploadedFiles,
    };
    const createRegistrationResponse = await createRegistration(registrationPayload);
    if (isErrorStatus(createRegistrationResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.create_registration'), variant: 'error' }));
      setIsLoading(false);
    } else if (isSuccessStatus(createRegistrationResponse.status)) {
      history.push(getRegistrationPath(createRegistrationResponse.data.identifier), { highestValidatedTab: -1 });
    }
  };

  return (
    <RegistrationAccordion elevation={5} expanded={expanded} onChange={onChange}>
      <AccordionSummary
        data-testid={dataTestId.registrationWizard.new.fileAccordion}
        expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <CloudUploadIcon />
        <div>
          <Typography variant="h2">{t('registration.registration.start_with_uploading_file_title')}</Typography>
          <Typography>{t('registration.registration.start_with_uploading_file_description')}</Typography>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        {uppy && (
          <>
            <FileUploader
              uppy={uppy}
              addFile={(newFile: AssociatedFile) => setUploadedFiles((files) => [newFile, ...files])}
            />
            {uploadedFiles.length > 0 && (
              <>
                <Typography variant="h3">{t('registration.files_and_license.files')}:</Typography>
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
        <LoadingButton
          data-testid={dataTestId.registrationWizard.new.startRegistrationButton}
          endIcon={<ArrowForwardIcon fontSize="large" />}
          loadingPosition="end"
          variant="contained"
          loading={isLoading}
          disabled={uploadedFiles.length === 0}
          onClick={createRegistrationWithFiles}>
          {t('registration.registration.start_registration')}
        </LoadingButton>
      </AccordionActions>
    </RegistrationAccordion>
  );
};
