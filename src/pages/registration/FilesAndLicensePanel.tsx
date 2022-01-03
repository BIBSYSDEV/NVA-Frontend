import { ErrorMessage, FieldArray, FieldArrayRenderProps, FormikErrors, useFormikContext } from 'formik';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, FormHelperText, Link, Paper, Typography } from '@mui/material';
import { UppyFile } from '@uppy/core';
import { Modal } from '../../components/Modal';
import { File, FileSet, licenses, Uppy } from '../../types/file.types';
import { NotificationVariant } from '../../types/notification.types';
import { FileFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { autoHideNotificationDuration } from '../../utils/constants';
import { FileUploader } from './files_and_license_tab/FileUploader';
import { FileCard } from './files_and_license_tab/FileCard';
import {
  getChannelRegisterJournalUrl,
  getChannelRegisterPublisherUrl,
} from '../public_registration/PublicPublicationContext';

interface FilesAndLicensePanelProps {
  uppy: Uppy;
}

export const FilesAndLicensePanel = ({ uppy }: FilesAndLicensePanelProps) => {
  const { t } = useTranslation('registration');
  const {
    values: { fileSet, entityDescription },
    setFieldTouched,
    errors,
    touched,
  } = useFormikContext<Registration>();
  const publicationContext = entityDescription?.reference?.publicationContext;
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const files = useMemo(() => fileSet?.files ?? [], [fileSet?.files]);

  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    // Avoid adding duplicated file names to an existing registration,
    // since files could have been uploaded in another session without being in uppy's current state
    uppy.setOptions({
      onBeforeFileAdded: (currentFile: UppyFile) => {
        if (filesRef.current.some((file: File) => file.name === currentFile.name)) {
          uppy.info(
            t('files_and_license.no_duplicates', { fileName: currentFile.name }),
            NotificationVariant.Info,
            autoHideNotificationDuration[NotificationVariant.Error]
          );
          return false;
        }
        return true;
      },
    });
  }, [t, uppy, filesRef]);

  const toggleLicenseModal = () => {
    setIsLicenseModalOpen(!isLicenseModalOpen);
  };

  const publisherIdentifier =
    (publicationContext &&
      'publisher' in publicationContext &&
      publicationContext.publisher?.id?.split('/').reverse()[1]) ||
    '';
  const seriesIdentifier =
    (publicationContext && 'series' in publicationContext && publicationContext.series?.id?.split('/').reverse()[1]) ||
    '';
  const journalIdentifier =
    (publicationContext && 'id' in publicationContext && publicationContext.id?.split('/').reverse()[1]) || '';

  return (
    <>
      {(publisherIdentifier || seriesIdentifier || journalIdentifier) && (
        <Paper sx={{ p: '1rem', mb: '1rem', bgcolor: 'background.default' }} elevation={5}>
          <Typography variant="h6" component="h2" gutterBottom>
            {t('files_and_license.info_from_channel_register')}
          </Typography>
          {journalIdentifier && (
            <Link href={getChannelRegisterJournalUrl(journalIdentifier)} target="_blank">
              <Typography paragraph>{t('files_and_license.find_journal_in_channel_register')}</Typography>
            </Link>
          )}
          {publisherIdentifier && (
            <Link href={getChannelRegisterPublisherUrl(publisherIdentifier)} target="_blank">
              <Typography gutterBottom>{t('files_and_license.find_publisher_in_channel_register')}</Typography>
            </Link>
          )}

          {seriesIdentifier && (
            <Link href={getChannelRegisterJournalUrl(seriesIdentifier)} target="_blank">
              <Typography paragraph>{t('files_and_license.find_series_in_channel_register')}</Typography>
            </Link>
          )}
        </Paper>
      )}

      <FieldArray name={FileFieldNames.Files}>
        {({ name, remove, push }: FieldArrayRenderProps) => (
          <div>
            {files.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mb: '2rem' }}>
                <Typography variant="h2">{t('files_and_license.files')}</Typography>
                {files.map((file, index) => (
                  <FileCard
                    key={file.identifier}
                    file={file}
                    removeFile={() => {
                      const remainingFiles = uppy
                        .getFiles()
                        .filter((uppyFile) => uppyFile.response?.uploadURL !== file.identifier);
                      uppy.setState({ files: remainingFiles });
                      remove(index);

                      if (remainingFiles.length === 0) {
                        // Ensure field is set to touched even if it's empty
                        setFieldTouched(name);
                      }
                    }}
                    toggleLicenseModal={toggleLicenseModal}
                    baseFieldName={`${name}[${index}]`}
                  />
                ))}
              </Box>
            )}

            <Paper elevation={5}>
              <FileUploader uppy={uppy} addFile={push} />
              {files.length === 0 &&
                typeof (errors.fileSet as FormikErrors<FileSet>).files === 'string' &&
                touched.fileSet && (
                  <FormHelperText error>
                    <ErrorMessage name={name} />
                  </FormHelperText>
                )}
            </Paper>
          </div>
        )}
      </FieldArray>

      <Modal
        headingText={t('files_and_license.licenses')}
        open={isLicenseModalOpen}
        onClose={toggleLicenseModal}
        maxWidth="sm"
        dataTestId="license-modal">
        {licenses.map((license) => (
          <Box key={license.identifier} sx={{ mb: '1rem', whiteSpace: 'pre-wrap' }}>
            <Typography variant="h6">{t(`licenses:labels.${license.identifier}`)}</Typography>
            <img src={license.logo} alt={license.identifier} />
            <Typography paragraph>{license.description}</Typography>
            {license.link && (
              <Link href={license.link} target="blank">
                {license.link}
              </Link>
            )}
          </Box>
        ))}
      </Modal>
    </>
  );
};
