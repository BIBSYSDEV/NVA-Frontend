import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import TabPanel from '../../components/TabPanel/TabPanel';
import { RootStore } from '../../redux/reducers/rootReducer';

import Box from '../../components/Box';

import UppyFileUpload from './UppyFileUpload';

interface FilesAndLicensesPanel {
  onClick: (event: React.MouseEvent<any>) => void;
  tabNumber: number;
}

const FilesAndLicensesPanel: React.FC<FilesAndLicensesPanel> = ({ onClick, tabNumber }) => {
  const { t } = useTranslation();
  const errors = useSelector((store: RootStore) => store.errors);

  return (
    <TabPanel
      isHidden={tabNumber !== 4}
      ariaLabel="files and licenses"
      onClick={onClick}
      errors={errors.filesAndLicensesErrors}
      heading={t('resource_form.files_and_licenses.header')}>
      <h1>{t('resource_form.files_and_licenses.upload_files')}</h1>
      <Box>
        <UppyFileUpload />
      </Box>
      <h1>{t('resource_form.files_and_licenses.files')}</h1>
      <Box>TODO</Box>
    </TabPanel>
  );
};

export default FilesAndLicensesPanel;
