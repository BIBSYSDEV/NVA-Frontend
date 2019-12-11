import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import UppyFileUpload from './files_and_license_tab/UppyFileUpload';

interface FilesAndLicensePanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  tabNumber: number;
}

const FilesAndLicensePanel: React.FC<FilesAndLicensePanelProps> = ({ goToNextTab, tabNumber }) => {
  const { t } = useTranslation('publication');

  return (
    <TabPanel
      isHidden={tabNumber !== 4}
      ariaLabel="files and license"
      goToNextTab={goToNextTab}
      heading={t('heading.files_and_license')}>
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
