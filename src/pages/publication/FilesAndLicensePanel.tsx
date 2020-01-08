import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import UppyFileUpload from './files_and_license_tab/UppyFileUpload';

interface FilesAndLicensePanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
}

const FilesAndLicensePanel: React.FC<FilesAndLicensePanelProps> = ({ goToNextTab }) => {
  const { t } = useTranslation('publication');

  return (
    <TabPanel ariaLabel="files and license" goToNextTab={goToNextTab}>
      <h1>{t('files_and_license.upload_files')}</h1>
      <Box>
        <UppyFileUpload />
      </Box>
      <h1>{t('files_and_license.files')}</h1>
      <Box>TODO</Box>
    </TabPanel>
  );
};

export default FilesAndLicensePanel;
