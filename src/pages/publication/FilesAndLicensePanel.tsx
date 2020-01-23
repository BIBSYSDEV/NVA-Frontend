import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import FileUploader from './files_and_license_tab/FileUploader';
import FileCard from './files_and_license_tab/FileCard';
import styled from 'styled-components';
import { File } from '../../types/license.types';
import { useFormikContext, FormikProps, FieldArray } from 'formik';
import { Publication } from '../../types/publication.types';

const StyledUploadedFiles = styled.section`
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: 1rem;
  }
`;

const dummyData = [
  {
    source: 'react:Dashboard',
    id: 'uppy-70/762/questions/pdf-1d-1d-1e-application/pdf-986995-1570106738413',
    name: '70-762-questions.pdf',
    extension: 'pdf',
    meta: {
      relativePath: null,
      name: '70-762-questions.pdf',
      type: 'application/pdf',
    },
    type: 'application/pdf',
    data: {
      lastModified: 1570106738413,
      name: '70-762-questions.pdf',
      size: 986995,
      type: 'application/pdf',
      webkitRelativePath: '',
    },
    progress: {
      uploadStarted: 1579770931894,
      uploadComplete: true,
      percentage: 100,
      bytesUploaded: 986995,
      bytesTotal: 986995,
    },
    size: 986995,
    isRemote: false,
    remote: '',
    tus: {
      uploadUrl:
        'https://master.tus.io/files/02c73fc8eb3b697c6d3168e5bfa46ff2+7gcyICHz9ng.EuHl0PGOQH17M0I_qxiVj9aWt5Jv5m4_9A0NsESGD9rmYHUn70hFpUb2A0ZL0inz4SWq7ILeNlD0ykxITQnN4zKyihEeIL9oU1EdFsfwmoTAwm5gcZ8h',
    },
    response: {
      uploadURL:
        'https://master.tus.io/files/02c73fc8eb3b697c6d3168e5bfa46ff2+7gcyICHz9ng.EuHl0PGOQH17M0I_qxiVj9aWt5Jv5m4_9A0NsESGD9rmYHUn70hFpUb2A0ZL0inz4SWq7ILeNlD0ykxITQnN4zKyihEeIL9oU1EdFsfwmoTAwm5gcZ8h',
    },
    uploadURL:
      'https://master.tus.io/files/02c73fc8eb3b697c6d3168e5bfa46ff2+7gcyICHz9ng.EuHl0PGOQH17M0I_qxiVj9aWt5Jv5m4_9A0NsESGD9rmYHUn70hFpUb2A0ZL0inz4SWq7ILeNlD0ykxITQnN4zKyihEeIL9oU1EdFsfwmoTAwm5gcZ8h',
    isPaused: false,
  },
  {
    source: 'react:Dashboard',
    id: 'uppy-a17/flightplan/pdf-2v-1e-application/pdf-20702285-1573824549293',
    name: 'A17_FlightPlan.pdf',
    extension: 'pdf',
    meta: {
      relativePath: null,
      name: 'A17_FlightPlan.pdf',
      type: 'application/pdf',
    },
    type: 'application/pdf',
    data: {
      lastModified: 1570106738413,
      name: '70-762-questions.pdf',
      size: 986995,
      type: 'application/pdf',
      webkitRelativePath: '',
    },
    progress: {
      uploadStarted: 1579770931897,
      uploadComplete: true,
      percentage: 100,
      bytesUploaded: 20702285,
      bytesTotal: 20702285,
    },
    size: 20702285,
    isRemote: false,
    remote: '',
    tus: {
      uploadUrl:
        'https://master.tus.io/files/a13bcb8921d6530a795230f49ec16525+7i_0GnFrNGQvzmHDJ43QS_Fa9Ts1jp1oFzfB2Vnuh8UT94OCWWvjpxXupjCbPNrtVmGT7Mt3q_.Hufw85tIbqhACWCeS_MHl_.lA88WhREfiT0bCWXg6Jzu4T8fMT5QQ',
    },
    response: {
      uploadURL:
        'https://master.tus.io/files/a13bcb8921d6530a795230f49ec16525+7i_0GnFrNGQvzmHDJ43QS_Fa9Ts1jp1oFzfB2Vnuh8UT94OCWWvjpxXupjCbPNrtVmGT7Mt3q_.Hufw85tIbqhACWCeS_MHl_.lA88WhREfiT0bCWXg6Jzu4T8fMT5QQ',
    },
    uploadURL:
      'https://master.tus.io/files/a13bcb8921d6530a795230f49ec16525+7i_0GnFrNGQvzmHDJ43QS_Fa9Ts1jp1oFzfB2Vnuh8UT94OCWWvjpxXupjCbPNrtVmGT7Mt3q_.Hufw85tIbqhACWCeS_MHl_.lA88WhREfiT0bCWXg6Jzu4T8fMT5QQ',
    isPaused: false,
  },
  {
    source: 'react:Dashboard',
    id: 'uppy-big/file/pdf-1d-1e-application/pdf-52428800-1573811920681',
    name: 'big-file.pdf',
    extension: 'pdf',
    meta: {
      relativePath: null,
      name: 'big-file.pdf',
      type: 'application/pdf',
    },
    type: 'application/pdf',
    data: {
      lastModified: 1570106738413,
      name: '70-762-questions.pdf',
      size: 986995,
      type: 'application/pdf',
      webkitRelativePath: '',
    },
    progress: {
      uploadStarted: 1579770931899,
      uploadComplete: true,
      percentage: 100,
      bytesUploaded: 52428800,
      bytesTotal: 52428800,
    },
    size: 52428800,
    isRemote: false,
    remote: '',
    tus: {
      uploadUrl:
        'https://master.tus.io/files/d67637af8243f83e589130fe0c431a42+14rHTS0_DZB8OZI0pZP02GnV18UuVcG8d1r4TkY2.ISt49BVRXSapTVDIfwSrWP40Knxupgj1QOaBoxr4nclBC2lTzG5My54gQ80jHXZ5v3RGElO9l44pPpmJRfACOMa',
    },
    response: {
      uploadURL:
        'https://master.tus.io/files/d67637af8243f83e589130fe0c431a42+14rHTS0_DZB8OZI0pZP02GnV18UuVcG8d1r4TkY2.ISt49BVRXSapTVDIfwSrWP40Knxupgj1QOaBoxr4nclBC2lTzG5My54gQ80jHXZ5v3RGElO9l44pPpmJRfACOMa',
    },
    uploadURL:
      'https://master.tus.io/files/d67637af8243f83e589130fe0c431a42+14rHTS0_DZB8OZI0pZP02GnV18UuVcG8d1r4TkY2.ISt49BVRXSapTVDIfwSrWP40Knxupgj1QOaBoxr4nclBC2lTzG5My54gQ80jHXZ5v3RGElO9l44pPpmJRfACOMa',
    isPaused: false,
  },
];

enum FilesFieldNames {
  FILES = 'files',
}

interface FilesAndLicensePanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
}

const FilesAndLicensePanel: React.FC<FilesAndLicensePanelProps> = ({ goToNextTab }) => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  const currentFiles = values[FilesFieldNames.FILES];

  console.log('values', values);
  return (
    <TabPanel ariaLabel="files and license" goToNextTab={goToNextTab}>
      <FieldArray name={FilesFieldNames.FILES}>
        {({ push, remove }) => (
          <>
            <h1>{t('files_and_license.upload_files')}</h1>
            <Box>
              <FileUploader
                addFile={file => {
                  push(file);
                }}
              />
            </Box>
            {currentFiles.length > 0 && (
              <>
                <h1>{t('files_and_license.files')}</h1>
                <StyledUploadedFiles>
                  {currentFiles.map((file, i) => (
                    <FileCard key={file.id} file={file} removeFile={() => remove(i)} />
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
