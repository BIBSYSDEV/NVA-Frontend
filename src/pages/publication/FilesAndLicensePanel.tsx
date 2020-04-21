import React, { useState, useEffect, useRef, FC } from 'react';
import { useTranslation } from 'react-i18next';
import FileUploader from './files_and_license_tab/FileUploader';
import FileCard from './files_and_license_tab/FileCard';
import styled from 'styled-components';
import { FieldArray, FormikProps, useFormikContext, ErrorMessage, FieldArrayRenderProps } from 'formik';
import { FormikPublication } from '../../types/publication.types';
import Modal from '../../components/Modal';
import { licenses, Uppy } from '../../types/file.types';
import Card from '../../components/Card';
import Heading from '../../components/Heading';
import PublicationChannelInfoCard from './files_and_license_tab/PublicationChannelInfoCard';
import NormalText from '../../components/NormalText';
import Label from '../../components/Label';
import { FormHelperText } from '@material-ui/core';
import { getAllFileFields } from '../../utils/formik-helpers';
import { FileFieldNames } from '../../types/publicationFieldNames';

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
`;

interface FilesAndLicensePanelProps {
  uppy: Uppy;
}

const FilesAndLicensePanel: FC<FilesAndLicensePanelProps> = ({ uppy }) => {
  const { t } = useTranslation('publication');
  const { values, setFieldTouched }: FormikProps<FormikPublication> = useFormikContext();
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

  // Set all fields to touched on unmount
  useEffect(
    () => () => {
      // Use filesRef to avoid trigging this useEffect on every values update
      const fieldNames = getAllFileFields(filesRef.current);
      fieldNames.forEach((fieldName) => setFieldTouched(fieldName));
    },
    [setFieldTouched]
  );

  const toggleLicenseModal = () => {
    setIsLicenseModalOpen(!isLicenseModalOpen);
  };

  return (
    <>
      {publicationContext && <PublicationChannelInfoCard publisher={publicationContext} />}

      <FieldArray name={FileFieldNames.FILES}>
        {({ insert, remove, name, form }: FieldArrayRenderProps) => (
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
              <>
                <StyledUploadedFiles>
                  <Heading>{t('files_and_license.files')}</Heading>
                  {files.map((file, index) => (
                    <FileCard
                      key={file.identifier}
                      file={file}
                      form={form}
                      removeFile={() => {
                        uppy.removeFile(file.identifier);
                        remove(index);
                      }}
                      toggleLicenseModal={toggleLicenseModal}
                      baseFieldName={`${name}[${index}]`}
                    />
                  ))}
                </StyledUploadedFiles>
              </>
            )}
          </>
        )}
      </FieldArray>
      <Modal headingText={t('files_and_license.licenses')} openModal={isLicenseModalOpen} onClose={toggleLicenseModal}>
        {licenses.map((license) => (
          <StyledLicenseDescription key={license.identifier}>
            <Label>{license.identifier}</Label>
            <img src={license.image} alt={license.identifier} />
            <NormalText>{license.description}</NormalText>
          </StyledLicenseDescription>
        ))}
      </Modal>
    </>
  );
};

export default FilesAndLicensePanel;
