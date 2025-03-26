import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloudUploadIcon from '@mui/icons-material/CloudUploadOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import Uppy from '@uppy/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { deleteRegistrationFile } from '../../../api/fileApi';
import { createRegistration } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/notificationSlice';
import { AssociatedFile } from '../../../types/associatedArtifact.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { createUppy } from '../../../utils/uppy/uppy-config';
import { getRegistrationWizardPath } from '../../../utils/urlPaths';
import { FileUploader } from '../files_and_license_tab/FileUploader';
import { StartRegistrationAccordionProps } from './LinkRegistration';
import { RegistrationAccordion } from './RegistrationAccordion';

interface DeleteFileMutationParams {
  registrationIdentifier: string;
  fileIdentifier: string;
}

export const UploadRegistration = ({ expanded, onChange }: StartRegistrationAccordionProps) => {
  const { t, i18n } = useTranslation();
  const [uploadedFiles, setUploadedFiles] = useState<AssociatedFile[]>([]);
  const dispatch = useDispatch();
  const [uppy, setUppy] = useState<Uppy>();

  const createRegistrationMutation = useMutation({
    mutationFn: async () => {
      const newRegistration = await createRegistration();
      return newRegistration.data;
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.create_registration'), variant: 'error' })),
  });

  const deleteFileMutation = useMutation({
    mutationFn: async ({ registrationIdentifier, fileIdentifier }: DeleteFileMutationParams) => {
      if (registrationIdentifier && fileIdentifier) {
        await deleteRegistrationFile(registrationIdentifier, fileIdentifier);
      }
    },
    onSuccess: () => dispatch(setNotification({ message: t('feedback.success.delete_file'), variant: 'success' })),
    onError: () => dispatch(setNotification({ message: t('feedback.error.delete_file'), variant: 'error' })),
  });

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
        {expanded && (
          <>
            {uppy ? (
              <FileUploader uppy={uppy} addFile={(newFile) => setUploadedFiles((files) => [newFile, ...files])} />
            ) : (
              <input
                type="file"
                onChange={async (e) => {
                  const newRegistration = await createRegistrationMutation.mutateAsync();
                  const newUppyInstance = createUppy(i18n.language, newRegistration.identifier);
                  setUppy(newUppyInstance);
                  const file = e.target.files?.[0];
                  if (file) {
                    newUppyInstance.addFile(file);
                  }
                }}
              />
            )}

            {uppy && uploadedFiles.length > 0 && (
              <>
                <Typography variant="h3">{t('registration.files_and_license.files')}:</Typography>
                {uploadedFiles.map((file) => {
                  const fileIdentifier = file.identifier;
                  return (
                    <Box
                      key={file.identifier}
                      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                      <Typography sx={{ wordBreak: 'break-all' }}>{file.name}</Typography>
                      <Button
                        color="error"
                        data-testid="button-remove-file" // TODO
                        variant="outlined"
                        loading={
                          deleteFileMutation.isPending &&
                          deleteFileMutation.variables?.fileIdentifier === fileIdentifier
                        }
                        startIcon={<RemoveCircleIcon />}
                        onClick={async () => {
                          const registrationIdentifier = createRegistrationMutation.data?.identifier;
                          if (registrationIdentifier && fileIdentifier) {
                            await deleteFileMutation.mutateAsync({ registrationIdentifier, fileIdentifier });
                          }

                          const uppyFiles = uppy.getFiles();
                          const uppyId = uppyFiles.find(
                            (uppyFile) => uppyFile.response?.body?.identifier === file.identifier
                          )?.id;
                          if (uppyId) {
                            uppy.removeFile(uppyId);
                          }

                          setUploadedFiles(
                            uploadedFiles.filter((uploadedFile) => uploadedFile.identifier !== file.identifier)
                          );
                        }}>
                        {t('common.remove')}
                      </Button>
                    </Box>
                  );
                })}
              </>
            )}
          </>
        )}
      </AccordionDetails>

      <AccordionActions>
        <Button
          data-testid={dataTestId.registrationWizard.new.startRegistrationButton}
          endIcon={<ArrowForwardIcon fontSize="large" />}
          variant="contained"
          disabled={
            uploadedFiles.length === 0 || !createRegistrationMutation.data?.identifier || deleteFileMutation.isPending
          }
          component={Link}
          to={
            createRegistrationMutation.data?.identifier
              ? getRegistrationWizardPath(createRegistrationMutation.data.identifier)
              : ''
          }
          state={{ highestValidatedTab: -1 }}>
          {t('registration.registration.start_registration')}
        </Button>
      </AccordionActions>
    </RegistrationAccordion>
  );
};
