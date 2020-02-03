import React from 'react';
import { useTranslation } from 'react-i18next';
import TabPanel from '../../components/TabPanel/TabPanel';
import FileUploader from './files_and_license_tab/FileUploader';
import FileCard from './files_and_license_tab/FileCard';
import styled from 'styled-components';
import { FieldArray, FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../types/publication.types';
import FormCard from '../../components/FormCard';
import FormCardHeading from '../../components/FormCardHeading';

const StyledUploadedFiles = styled.section`
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: 1rem;
  }
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
  const uploadedFiles = values[FilesFieldNames.FILES];

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
                <FormCardHeading>{t('files_and_license.files')}</FormCardHeading>
                <StyledUploadedFiles>
                  {uploadedFiles.map((file, i) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      removeFile={() => remove(i)}
                      updateFile={newFile => replace(i, newFile)}
                    />
                  ))}
                </StyledUploadedFiles>
              </>
            )}
          </>
        )}
      </FieldArray>
    </TabPanel>
  );
};

export default FilesAndLicensePanel;
