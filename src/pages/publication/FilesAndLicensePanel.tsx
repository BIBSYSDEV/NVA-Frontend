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
  const [licenseModalIsOpen, setLicenseModalIsOpen] = useState(false);
  const uploadedFiles = [
    {
      id: 'uppy-img/jpg-1e-image/jpeg-10441-1573761889133',
      name: 'img.jpg',
      uploadUrl:
        'https://master.tus.io/files/eea3b19c18cced20e24f81780210469a+x0MvmT59gUbdTBetll_EVRccMwmdfa5EFsqXg_6qFBqw8kRJDZdZJrjKyzO_XXuWD71E103ZHkjcd0B.8RU3GDujxz9_yztyO91wpqxvdWCa4FrhyeQXUuOVlcEt7m.J',
      data: { size: 1000 },
      administrativeContract: false,
      isPublished: null,
      embargoDate: null,
      license: '',
      source: 'react:Dashboard',
      extension: 'jpg',
      meta: {
        relativePath: null,
        name: 'img.jpg',
        type: 'image/jpeg',
      },
      type: 'image/jpeg',
      progress: {
        percentage: 0,
        bytesUploaded: 0,
        bytesTotal: 10441,
        uploadComplete: false,
        uploadStarted: null,
      },
      size: 10441,
      isRemote: false,
      remote: '',
    },
  ]; // values[FilesFieldNames.FILES]

  const toggleLicenseModal = () => {
    setLicenseModalIsOpen(!licenseModalIsOpen);
  };

  return (
    <TabPanel ariaLabel="files and license" goToNextTab={goToNextTab}>
      <FieldArray name={FilesFieldNames.FILES}>
        {({ push, remove, replace }) => (
          <>
            <Typography variant="h2">{t('files_and_license.upload_files')}</Typography>
            <Box>
              <FileUploader uppy={uppy} addFile={file => push(file)} />
            </Box>
            {uploadedFiles.length > 0 && (
              <>
                <Typography variant="h2">{t('files_and_license.files')}</Typography>
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
      <Modal headingText={t('files_and_license.licenses')} openModal={licenseModalIsOpen} onClose={toggleLicenseModal}>
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
