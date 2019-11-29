import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { RootStore } from '../../redux/reducers/rootReducer';
import UppyFileUpload from './UppyFileUpload';

interface FilesAndLicensePanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  tabNumber: number;
}

const FilesAndLicensePanel: React.FC<FilesAndLicensePanelProps> = ({ goToNextTab, tabNumber }) => {
  const { t } = useTranslation();
  const errors = useSelector((store: RootStore) => store.errors);

  return (
    <TabPanel
      isHidden={tabNumber !== 4}
      ariaLabel="files and license"
      goToNextTab={goToNextTab}
      errors={errors.filesAndLicenseErrors}
      heading={t('publication:files_and_license_heading')}>
      <h1>{t('publication:files_and_license.upload_files')}</h1>
      <Box>
        <UppyFileUpload />
      </Box>
      <h1>{t('publication:files_and_license.files')}</h1>
      <Box>TODO</Box>
    </TabPanel>
  );
};

export default FilesAndLicensePanel;
