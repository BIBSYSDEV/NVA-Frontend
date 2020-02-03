import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import FileUploader from './files_and_license_tab/FileUploader';
import FileCard from './files_and_license_tab/FileCard';
import styled from 'styled-components';
import { useFormikContext, FormikProps, FieldArray } from 'formik';
import { Publication } from '../../types/publication.types';
import Modal from '../../components/Modal';
import { licenses } from '../../types/file.types';
import { Typography } from '@material-ui/core';

const StyledUploadedFiles = styled.section`
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
  const [openLicenseModal, setOpenLicenseModal] = useState(false);
  const uploadedFiles = values[FilesFieldNames.FILES];

  const toggleLicenseModal = () => {
    setOpenLicenseModal(!openLicenseModal);
  };

  return (
    <TabPanel ariaLabel="files and license" goToNextTab={goToNextTab}>
      <FieldArray name={FilesFieldNames.FILES}>
        {({ push, remove, replace }) => (
          <>
            <h1>{t('files_and_license.upload_files')}</h1>
            <Box>
              <FileUploader uppy={uppy} addFile={file => push(file)} />
            </Box>
            {uploadedFiles.length > 0 && (
              <>
                <h1>{t('files_and_license.files')}</h1>
                <StyledUploadedFiles>
                  {uploadedFiles.map((file, i) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      removeFile={() => remove(i)}
                      updateFile={newFile => replace(i, newFile)}
                      toggleLicenseModal={toggleLicenseModal}
                    />
                  ))}
                </StyledUploadedFiles>
              </>
            )}
          </>
        )}
      </FieldArray>
      <Modal headingText={t('files_and_license.licenses')} openModal={openLicenseModal} onClose={toggleLicenseModal}>
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
