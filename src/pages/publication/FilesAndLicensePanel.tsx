import React, { useState, useEffect, useRef, FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FieldArray, FormikProps, useFormikContext, ErrorMessage, FieldArrayRenderProps } from 'formik';
import { FormHelperText } from '@material-ui/core';
import FileUploader from './files_and_license_tab/FileUploader';
import FileCard from './files_and_license_tab/FileCard';
import { FormikPublication, Publisher } from '../../types/publication.types';
import Modal from '../../components/Modal';
import { licenses, Uppy } from '../../types/file.types';
import Card from '../../components/Card';
import Heading from '../../components/Heading';
import PublicationChannelInfoCard from './files_and_license_tab/PublicationChannelInfoCard';
import NormalText from '../../components/NormalText';
import Label from '../../components/Label';
import { FileFieldNames } from '../../types/publicationFieldNames';
import { touchedFilesTabFields } from '../../utils/formik-helpers';
import { PanelProps } from './PublicationFormContent';

const shouldAllowMultipleFiles = true;

const StyledUploadedFiles = styled(Card)`
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: 1rem;
  }
`;

const StyledLicenseDescription = styled.article`
  margin-bottom: 1rem;
  white-space: pre-wrap;
`;

interface FilesAndLicensePanelProps extends PanelProps {
  uppy: Uppy;
}

const FilesAndLicensePanel: FC<FilesAndLicensePanelProps> = ({ uppy, setTouchedFields }) => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<FormikPublication> = useFormikContext();
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const {
    fileSet: { files },
    entityDescription: {
      reference: { publicationContext },
    },
  } = values;

  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(
    // Set all fields to touched on unmount
    // Use filesRef to avoid trigging this useEffect on every values update
    () => () => setTouchedFields(touchedFilesTabFields(filesRef.current)),
    [setTouchedFields]
  );

  const toggleLicenseModal = () => {
    setIsLicenseModalOpen(!isLicenseModalOpen);
  };

  return (
    <>
      {publicationContext && <PublicationChannelInfoCard publisher={publicationContext as Publisher} />}

      <FieldArray name={FileFieldNames.FILES}>
        {({ insert, remove, name }: FieldArrayRenderProps) => (
          <>
            <Card>
              <Heading>{t('files_and_license.upload_files')}</Heading>
              <FileUploader
                uppy={uppy}
                shouldAllowMultipleFiles={shouldAllowMultipleFiles}
                addFile={(file) => insert(0, file)}
              />
              {files.length === 0 && (
                <FormHelperText error>
                  <ErrorMessage name={name} />
                </FormHelperText>
              )}
            </Card>

            {files.length > 0 && (
              <StyledUploadedFiles>
                <Heading>{t('files_and_license.files')}</Heading>
                {files.map((file, index) => (
                  <FileCard
                    key={index}
                    file={file}
                    removeFile={() => {
                      uppy.removeFile(file.identifier);
                      remove(index);
                    }}
                    toggleLicenseModal={toggleLicenseModal}
                    baseFieldName={`${name}[${index}]`}
                  />
                ))}
              </StyledUploadedFiles>
            )}
          </>
        )}
      </FieldArray>
      <Modal
        headingText={t('files_and_license.licenses')}
        openModal={isLicenseModalOpen}
        onClose={toggleLicenseModal}
        maxWidth="md">
        {licenses.map((license) => (
          <StyledLicenseDescription key={license.identifier}>
            <Label>{license.identifier}</Label>
            <img src={license.buttonImage} alt={license.identifier} />
            <NormalText>{license.description}</NormalText>
          </StyledLicenseDescription>
        ))}
      </Modal>
    </>
  );
};

export default FilesAndLicensePanel;
