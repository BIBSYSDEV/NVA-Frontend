import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TabPanel from '../../components/TabPanel/TabPanel';
import FileUploader from './files_and_license_tab/FileUploader';
import FileCard from './files_and_license_tab/FileCard';
import styled from 'styled-components';
import { FieldArray, FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../types/publication.types';
import Modal from '../../components/Modal';
import { licenses } from '../../types/file.types';
import { Typography } from '@material-ui/core';
import FormCard from '../../components/FormCard/FormCard';
import FormCardHeading from '../../components/FormCard/FormCardHeading';

const StyledUploadedFiles = styled(FormCard)`
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
  FILES = 'files',
}

interface FilesAndLicensePanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  uppy: any;
}

const FilesAndLicensePanel: React.FC<FilesAndLicensePanelProps> = ({ goToNextTab, uppy }) => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const uploadedFiles = values[FilesFieldNames.FILES];

  const toggleLicenseModal = () => {
    setIsLicenseModalOpen(!isLicenseModalOpen);
  };

  return (
    <TabPanel ariaLabel="files and license" goToNextTab={goToNextTab}>
      <FieldArray name={FilesFieldNames.FILES}>
        {({ push, remove, replace }) => (
          <>
            <FormCard>
              <FormCardHeading>{t('files_and_license.upload_files')}</FormCardHeading>
              <FileUploader uppy={uppy} addFile={file => push(file)} />
            </FormCard>
            {uploadedFiles.length > 0 && (
              <>
                <StyledUploadedFiles>
                  <FormCardHeading>{t('files_and_license.files')}</FormCardHeading>
                  {uploadedFiles.map((file, index) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      removeFile={() => {
                        uppy.removeFile(file.id);
                        remove(index);
                      }}
                      updateFile={newFile => replace(index, newFile)}
                      toggleLicenseModal={toggleLicenseModal}
                    />
                  ))}
                </StyledUploadedFiles>
              </>
            )}
          </>
        )}
      </FieldArray>
      <Modal headingText={t('files_and_license.licenses')} openModal={isLicenseModalOpen} onClose={toggleLicenseModal}>
        {licenses.map(license => (
          <StyledLicenseDescription key={license.name}>
            <Typography variant="h6">{license.name}</Typography>
            <img src={license.image} alt={license.name} />
            <Typography variant="body2">{license.description}</Typography>
          </StyledLicenseDescription>
        ))}
      </Modal>
    </TabPanel>
  );
};

export default FilesAndLicensePanel;
