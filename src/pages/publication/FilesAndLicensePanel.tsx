import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import TabPanel from '../../components/TabPanel/TabPanel';
import FileUploader from './files_and_license_tab/FileUploader';
import FileCard from './files_and_license_tab/FileCard';
import styled from 'styled-components';
import { FieldArray, FormikProps, useFormikContext, ErrorMessage } from 'formik';
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

enum FilesFieldNames {
  FILES = 'fileSet',
}

interface FilesAndLicensePanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  uppy: Uppy;
}

const FilesAndLicensePanel: React.FC<FilesAndLicensePanelProps> = ({ goToNextTab, uppy }) => {
  const { t } = useTranslation('publication');
  const { values, setFieldTouched }: FormikProps<FormikPublication> = useFormikContext();
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);

  const valuesRef = useRef(values);
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  // Set all fields to touched on unmount
  useEffect(() => {
    return () => {
      // Use valuesRef to avoid trigging this useEffect on every values update
      const fieldNames = getAllFileFields(valuesRef.current.fileSet.length);
      fieldNames.forEach((fieldName) => setFieldTouched(fieldName));
    };
  }, [setFieldTouched]);

  const toggleLicenseModal = () => {
    setIsLicenseModalOpen(!isLicenseModalOpen);
  };

  const {
    fileSet,
    entityDescription: {
      reference: { publicationContext },
    },
  } = values;

  return (
    <TabPanel ariaLabel="files and license" goToNextTab={goToNextTab}>
      {publicationContext && <PublicationChannelInfoCard publisher={publicationContext} />}

      <FieldArray name={FilesFieldNames.FILES}>
        {({ insert, remove, name }) => (
          <>
            <Card>
              <Heading>{t('files_and_license.upload_files')}</Heading>
              <FileUploader
                uppy={uppy}
                shouldAllowMultipleFiles={shouldAllowMultipleFiles}
                addFile={(file) => insert(0, file)}
              />
              {values.fileSet.length === 0 && (
                <FormHelperText error>
                  <ErrorMessage name={name} />
                </FormHelperText>
              )}
            </Card>

            {fileSet.length > 0 && (
              <>
                <StyledUploadedFiles>
                  <Heading>{t('files_and_license.files')}</Heading>
                  {fileSet.map((file, index) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      removeFile={() => {
                        uppy.removeFile(file.id);
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
    </TabPanel>
  );
};

export default FilesAndLicensePanel;
