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
import { Typography, Avatar } from '@material-ui/core';
import FormCard from '../../components/FormCard/FormCard';
import FormCardHeading from '../../components/FormCard/FormCardHeading';
import { openAccessLogo } from '../../resources/images/licenses';
import FormCardLabel from '../../components/FormCard/FormCardLabel';

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

const StyledInfoEntries = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledAvatar = styled(Avatar)`
  object-fit: contain;
  height: 100%;
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
  const referenceType = values.reference.type;
  const publisher = referenceType && values.reference[referenceType]?.publisher;

  const toggleLicenseModal = () => {
    setIsLicenseModalOpen(!isLicenseModalOpen);
  };

  return (
    <TabPanel ariaLabel="files and license" goToNextTab={goToNextTab}>
      {publisher && (
        <FormCard>
          <FormCardHeading>{t('files_and_license.info_from_channel_register.title')}</FormCardHeading>
          <StyledInfoEntries>
            <div>
              <FormCardLabel>{publisher.title}</FormCardLabel>
              <Typography variant="body1">
                {publisher.isOpenAccess
                  ? t('files_and_license.info_from_channel_register.open_publishment')
                  : t('files_and_license.info_from_channel_register.no_open_publishment')}
              </Typography>
            </div>
            {publisher.isOpenAccess && (
              <StyledAvatar
                variant="square"
                src={openAccessLogo}
                alt={t('files_and_license.info_from_channel_register.open_access')}
              />
            )}
          </StyledInfoEntries>
        </FormCard>
      )}

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
