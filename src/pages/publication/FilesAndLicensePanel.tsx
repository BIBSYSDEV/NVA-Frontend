import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import FileUploader from './files_and_license_tab/FileUploader';
import FileCard from './files_and_license_tab/FileCard';

interface FilesAndLicensePanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
}

const FilesAndLicensePanel: React.FC<FilesAndLicensePanelProps> = ({ goToNextTab }) => {
  const [files, setFiles] = useState<any[]>([]);
  const { t } = useTranslation('publication');

  const addFile = (file: any) => {
    setFiles([...files, file]);
  };

  return (
    <TabPanel ariaLabel="files and license" goToNextTab={goToNextTab}>
      <h1>{t('files_and_license.upload_files')}</h1>
      <Box>
        <FileUploader addFile={addFile} />
      </Box>

      <h1>{t('files_and_license.files')}</h1>
      <Box>
        {files.map(file => (
          <FileCard key={file.id} file={file} />
        ))}
      </Box>
    </TabPanel>
  );
};

export default FilesAndLicensePanel;
