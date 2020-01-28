import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import FileUploader from './files_and_license_tab/FileUploader';
import FileCard from './files_and_license_tab/FileCard';
import styled from 'styled-components';
import { useFormikContext, FormikProps, FieldArray } from 'formik';
import { Publication } from '../../types/publication.types';

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
}

const FilesAndLicensePanel: React.FC<FilesAndLicensePanelProps> = ({ goToNextTab }) => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();
  const uploadedFiles = values[FilesFieldNames.FILES];

  return (
    <TabPanel ariaLabel="files and license" goToNextTab={goToNextTab}>
      <FieldArray name={FilesFieldNames.FILES}>
        {({ push, remove, replace }) => (
          <>
            <h1>{t('files_and_license.upload_files')}</h1>
            <Box>
              <FileUploader
                addFile={file => {
                  push(file);
                }}
              />
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
