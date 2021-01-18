import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { File } from '../../../types/file.types';
import DangerButton from '../../../components/DangerButton';

const StyledFileRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface UploadedFileRowProps {
  file: File;
  removeFile: () => void;
}

const UploadedFileRow = ({ file, removeFile }: UploadedFileRowProps) => {
  const { t } = useTranslation('common');
  return (
    <StyledFileRow data-testid="uploaded-file">
      <Typography>{file.name}</Typography>
      <DangerButton variant="outlined" startIcon={<RemoveCircleIcon />} onClick={removeFile}>
        {t('remove')}
      </DangerButton>
    </StyledFileRow>
  );
};

export default UploadedFileRow;
