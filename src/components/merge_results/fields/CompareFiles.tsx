import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import RestoreIcon from '@mui/icons-material/Restore';
import { Button, styled } from '@mui/material';
import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AssociatedFile } from '../../../types/associatedArtifact.types';
import { FileBox } from './FileBox';

const StyledButton = styled(Button)({
  width: 'fit-content',
  margin: '0 auto',
});

interface CompareFilesProps {
  sourceFile?: AssociatedFile;
  targetFile?: AssociatedFile;
  matchingTargetFileIndex?: number;
}

export const CompareFiles = ({ sourceFile, targetFile, matchingTargetFileIndex = -1 }: CompareFilesProps) => {
  const { t } = useTranslation();
  const { append, remove } = useFieldArray({ name: 'associatedArtifacts' });

  const canCopyFile = !!sourceFile && !targetFile;
  const canRemoveFile = !!sourceFile && !!targetFile && matchingTargetFileIndex > -1;

  return (
    <>
      <FileBox file={sourceFile} />

      {canCopyFile && (
        <StyledButton
          variant="contained"
          size="small"
          endIcon={<ArrowForwardIcon />}
          onClick={() => append(sourceFile)}>
          {t('add_file')}
        </StyledButton>
      )}
      {canRemoveFile && (
        <StyledButton
          variant="outlined"
          size="small"
          endIcon={<RestoreIcon />}
          onClick={() => remove(matchingTargetFileIndex)}>
          {t('reset')}
        </StyledButton>
      )}

      <FileBox file={targetFile} sx={{ gridColumn: '3' }} />
    </>
  );
};
