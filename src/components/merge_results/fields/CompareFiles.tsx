import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import RestoreIcon from '@mui/icons-material/Restore';
import { Button, Divider, styled, Typography } from '@mui/material';
import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AssociatedFile } from '../../../types/associatedArtifact.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { isOnImportPage } from '../../../utils/urlPaths';
import { FileBox } from './FileBox';

const StyledButton = styled(Button)({
  width: 'fit-content',
  margin: '0 auto',
});

interface CompareFilesProps {
  sourceFile?: AssociatedFile;
  targetFile?: AssociatedFile;
  matchingTargetFileIndex?: number;
  canUploadFileToTarget: boolean;
}

export const CompareFiles = ({
  sourceFile,
  targetFile,
  matchingTargetFileIndex = -1,
  canUploadFileToTarget,
}: CompareFilesProps) => {
  const { t } = useTranslation();
  const { append, remove } = useFieldArray({ name: 'associatedArtifacts' });

  const canCopyFile = canUploadFileToTarget && !!sourceFile && !targetFile;
  const canRemoveFile = !!sourceFile && !!targetFile && matchingTargetFileIndex > -1;

  return (
    <>
      <Typography variant="h3" sx={{ display: { xs: 'block', sm: 'none' } }}>
        {isOnImportPage() ? t('basic_data.central_import.import_candidate') : t('unpublished_result')}
      </Typography>
      <FileBox file={sourceFile} />

      {canCopyFile && (
        <StyledButton
          data-testid={dataTestId.basicData.centralImport.copyValueButton}
          variant="contained"
          size="small"
          endIcon={<ArrowForwardIcon />}
          onClick={() => append(sourceFile)}>
          {t('add_file')}
        </StyledButton>
      )}
      {canRemoveFile && (
        <StyledButton
          data-testid={dataTestId.basicData.centralImport.resetValueButton}
          variant="outlined"
          size="small"
          endIcon={<RestoreIcon />}
          onClick={() => remove(matchingTargetFileIndex)}>
          {t('reset')}
        </StyledButton>
      )}

      <Typography variant="h3" sx={{ display: { xs: 'block', sm: 'none' } }}>
        {t('published_result')}
      </Typography>
      <FileBox file={targetFile} sx={{ gridColumn: { xs: 1, sm: 3 } }} />

      <Divider sx={{ display: { xs: 'block', sm: 'none' }, my: '0.5rem' }} />
    </>
  );
};
