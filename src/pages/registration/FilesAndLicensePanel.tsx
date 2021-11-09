import { ErrorMessage, FieldArray, FieldArrayRenderProps, FormikErrors, useFormikContext } from 'formik';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FormHelperText, Link, Typography } from '@mui/material';
import { UppyFile } from '@uppy/core';
import { BackgroundDiv } from '../../components/BackgroundDiv';
import { Modal } from '../../components/Modal';
import { lightTheme } from '../../themes/lightTheme';
import { File, FileSet, licenses, Uppy } from '../../types/file.types';
import { NotificationVariant } from '../../types/notification.types';
import { FileFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { autoHideNotificationDuration } from '../../utils/constants';
import { FileUploader } from './files_and_license_tab/FileUploader';
import { FileCard } from './files_and_license_tab/FileCard';

const StyledBackgroundDiv = styled(BackgroundDiv)`
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: 1rem;
  }
`;

const StyledLicenseDescription = styled.div`
  margin-bottom: 1rem;
  white-space: pre-wrap;
`;

interface FilesAndLicensePanelProps {
  uppy: Uppy;
}

export const FilesAndLicensePanel = ({ uppy }: FilesAndLicensePanelProps) => {
  const { t } = useTranslation('registration');
  const {
    values: { fileSet },
    setFieldTouched,
    setFieldValue,
    errors,
    touched,
  } = useFormikContext<Registration>();
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

  return (
    <>
      <FieldArray name={FileFieldNames.Files}>
        {({ name, remove, push }: FieldArrayRenderProps) => (
          <>
            {files.length > 0 && (
              <StyledBackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
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
              </StyledBackgroundDiv>
            )}

            <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
              <FileUploader
                uppy={uppy}
                addFile={(file) => {
                  if (!fileSet?.type) {
                    setFieldValue(FileFieldNames.FileSetType, 'FileSet');
                  }
                  push(file);
                }}
              />
              {files.length === 0 &&
                typeof (errors.fileSet as FormikErrors<FileSet>).files === 'string' &&
                touched.fileSet && (
                  <FormHelperText error>
                    <ErrorMessage name={name} />
                  </FormHelperText>
                )}
            </BackgroundDiv>
          </>
        )}
      </FieldArray>
      <Modal
        headingText={t('files_and_license.licenses')}
        open={isLicenseModalOpen}
        onClose={toggleLicenseModal}
        maxWidth="sm"
        dataTestId="license-modal">
        {licenses.map((license) => (
          <StyledLicenseDescription key={license.identifier}>
            <Typography variant="h6">{t(`licenses:labels.${license.identifier}`)}</Typography>
            <img src={license.logo} alt={license.identifier} />
            <Typography paragraph>{license.description}</Typography>
            {license.link && (
              <Link href={license.link} target="blank">
                {license.link}
              </Link>
            )}
          </StyledLicenseDescription>
        ))}
      </Modal>
    </>
  );
};
