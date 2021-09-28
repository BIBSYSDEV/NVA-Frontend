import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, Typography } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { File } from '../../../types/file.types';

const StyledFileRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface UploadedFileRowProps {
  file: File;
  removeFile: () => void;
}

export const UploadedFileRow = ({ file, removeFile }: UploadedFileRowProps) => {
  const { t } = useTranslation('common');
  return (
    <StyledFileRow data-testid="uploaded-file">
      <Typography>{file.name}</Typography>
      <Button
        color="error"
        data-testid="button-remove-file"
        variant="outlined"
        startIcon={<RemoveCircleIcon />}
        onClick={removeFile}>
        {t('remove')}
      </Button>
    </StyledFileRow>
  );
};
