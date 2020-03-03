import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TabPanel from '../../components/TabPanel/TabPanel';
import FileUploader from './files_and_license_tab/FileUploader';
import FileCard from './files_and_license_tab/FileCard';
import styled from 'styled-components';
import { FieldArray, FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../types/publication.types';
import Modal from '../../components/Modal';
import { licenses, Uppy } from '../../types/file.types';
import Card from '../../components/Card';
import Heading from '../../components/Heading';
import PublicationChannelInfoCard from './files_and_license_tab/PublicationChannelInfoCard';
import NormalText from '../../components/NormalText';
import Label from '../../components/Label';

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
  FILES = 'files',
}

interface FilesAndLicensePanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  uppy: Uppy;
}

const FilesAndLicensePanel: React.FC<FilesAndLicensePanelProps> = ({ goToNextTab, uppy }) => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const shouldAllowMultipleFiles = true;

  const uploadedFiles = values[FilesFieldNames.FILES];
  const referenceType = values.reference.type;
  const publisher = referenceType ? values.reference[referenceType]?.publisher : null;

  const toggleLicenseModal = () => {
    setIsLicenseModalOpen(!isLicenseModalOpen);
  };

  return (
    <TabPanel ariaLabel="files and license" goToNextTab={goToNextTab}>
      {publisher?.title && <PublicationChannelInfoCard publisher={publisher} />}

      <FieldArray name={FilesFieldNames.FILES}>
        {({ insert, remove, replace }) => (
          <>
            <FileUploader
              uppy={uppy}
              shouldAllowMultipleFiles={shouldAllowMultipleFiles}
              addFile={file => insert(0, file)}
            />
            {uploadedFiles.length > 0 && (
              <>
                <StyledUploadedFiles>
                  <Heading>{t('files_and_license.files')}</Heading>
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
            <Label>{license.name}</Label>
            <img src={license.image} alt={license.name} />
            <NormalText>{license.description}</NormalText>
          </StyledLicenseDescription>
        ))}
      </Modal>
    </TabPanel>
  );
};

export default FilesAndLicensePanel;
