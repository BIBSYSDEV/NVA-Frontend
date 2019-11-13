import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import TabPanel from '../../components/TabPanel/TabPanel';
import { RootStore } from '../../redux/reducers/rootReducer';
import styled from 'styled-components';

import Box from '../../components/Box';
import { Input } from '@material-ui/core';

interface FilesAndLicensesPanel {
  onClick: (event: React.MouseEvent<any>) => void;
  tabNumber: number;
}

const StyledFilesAndLicenses = styled.div`
  * {
    margin-bottom: 2rem;
  }
`;

const FilesAndLicensesPanel: React.FC<FilesAndLicensesPanel> = ({ onClick, tabNumber }) => {
  const { t } = useTranslation();
  const errors = useSelector((store: RootStore) => store.errors);

  return (
    <TabPanel
      isHidden={tabNumber !== 4}
      ariaLabel="files and licenses"
      onClick={onClick}
      errors={errors.filesAndLicensesErrors}
      heading={t('filesAndLicenses')}>
      <StyledFilesAndLicenses>
        <Box>
          Upload files
          {/* TODO: https://www.npmjs.com/package/material-ui-dropzone */}
          <Input type="file" placeholder="TEAST">
            UPLOAD FLIe
          </Input>
        </Box>
        <Box>Uploaded files</Box>
        <Box>License</Box>
      </StyledFilesAndLicenses>
    </TabPanel>
  );
};

export default FilesAndLicensesPanel;
