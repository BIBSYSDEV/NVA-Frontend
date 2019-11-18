import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import TabPanel from '../../components/TabPanel/TabPanel';
import { RootStore } from '../../redux/reducers/rootReducer';

import Box from '../../components/Box';

import UppyFileUpload from './UppyFileUpload';

interface FilesAndLicensePanelProps {
  onClick: (event: React.MouseEvent<any>) => void;
  tabNumber: number;
}

const FilesAndLicensePanel: React.FC<FilesAndLicensePanelProps> = ({ onClick, tabNumber }) => {
  const { t } = useTranslation();
  const errors = useSelector((store: RootStore) => store.errors);

  return (
    <TabPanel
      isHidden={tabNumber !== 4}
      ariaLabel="files and license"
      onClick={onClick}
      errors={errors.filesAndLicenseErrors}
      heading={t('resource_form.files_and_license.header')}>
      <h1>{t('resource_form.files_and_license.upload_files')}</h1>
      <Box>
        <UppyFileUpload />
      </Box>
      <h1>{t('resource_form.files_and_license.files')}</h1>
      <Box>TODO</Box>
    </TabPanel>
  );
};

export default FilesAndLicensePanel;
