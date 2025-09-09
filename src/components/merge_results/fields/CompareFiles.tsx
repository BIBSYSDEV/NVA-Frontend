import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import RestoreIcon from '@mui/icons-material/Restore';
import { Button } from '@mui/material';
import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AssociatedFile } from '../../../types/associatedArtifact.types';
import { FileBox } from './FileBox';

interface CompareFilesProps {
  sourceFile?: AssociatedFile;
  targetFile?: AssociatedFile;
  matchingTargetFileIndex?: number;
}

export const CompareFiles = ({ sourceFile, targetFile, matchingTargetFileIndex }: CompareFilesProps) => {
  const { t } = useTranslation();
  const { append, remove } = useFieldArray({ name: 'associatedArtifacts' });

  const canCopyFile = !!sourceFile && !targetFile;
  const canRemoveFile = !!sourceFile && !!targetFile && matchingTargetFileIndex !== undefined;

  return (
    <>
      <FileBox file={sourceFile} />
      {canCopyFile && (
        <Button
          variant="contained"
          size="small"
          sx={{ width: 'fit-content', mx: 'auto' }}
          endIcon={<ArrowForwardIcon />}
          onClick={() => append(sourceFile)}>
          {t('add_file')}
        </Button>
      )}
      {canRemoveFile && (
        <Button
          variant="outlined"
          size="small"
          sx={{ width: 'fit-content', mx: 'auto' }}
          endIcon={<RestoreIcon />}
          onClick={() => remove(matchingTargetFileIndex)}>
          {t('reset')}
        </Button>
      )}
      <FileBox file={targetFile} sx={{ gridColumn: '3' }} />
    </>
  );
};
