import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, BoxProps, Button, Typography } from '@mui/material';
import prettyBytes from 'pretty-bytes';
import { useContext } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { FileUploaderInfo } from '../../pages/public_registration/public_files/FileUploaderInfo';
import { AssociatedArtifact, AssociatedFile } from '../../types/associatedArtifact.types';
import { Registration } from '../../types/registration.types';
import { getAssociatedFiles } from '../../utils/registration-helpers';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

export const MergeResultsWizardFilesTab = () => {
  const { formState } = useFormContext<Registration>();
  const targetAssociatedArtifacts = useWatch({ name: 'associatedArtifacts' }) ?? [];
  const targetFiles = getAssociatedFiles(targetAssociatedArtifacts);

  const targetArtifacts = (formState.defaultValues?.associatedArtifacts ?? []) as AssociatedArtifact[];
  const initialTargetFiles = getAssociatedFiles(targetArtifacts);

  const { sourceResult } = useContext(MergeResultsWizardContext);
  const sourceAssociatedArtifacts = sourceResult.associatedArtifacts ?? [];
  const sourceFiles = getAssociatedFiles(sourceAssociatedArtifacts);

  return (
    <>
      {initialTargetFiles.map((targetFile) => (
        <CompareFiles key={targetFile.identifier} targetFile={targetFile} />
      ))}

      {sourceFiles.map((sourceFile) => {
        const matchingTargetFile = targetFiles.find((targetFile) => targetFile.identifier === sourceFile.identifier);
        return <CompareFiles key={sourceFile.identifier} sourceFile={sourceFile} targetFile={matchingTargetFile} />;
      })}
    </>
  );
};

interface FileBoxProps extends BoxProps {
  file?: AssociatedFile;
}

const FileBox = ({ file, sx }: FileBoxProps) => {
  return (
    <Box sx={{ p: '0.5rem', bgcolor: '#FEFBF3', height: '100%', ...sx }}>
      {!file ? null : (
        <>
          <Typography>
            <strong>{file.name}</strong>
          </Typography>
          <Typography>{prettyBytes(file.size, { locale: true })}</Typography>
          <FileUploaderInfo uploadDetails={file.uploadDetails} />
        </>
      )}
    </Box>
  );
};

interface CompareFilesProps {
  sourceFile?: AssociatedFile;
  targetFile?: AssociatedFile;
}

const CompareFiles = ({ sourceFile, targetFile }: CompareFilesProps) => {
  const { append, remove, insert } = useFieldArray({ name: 'associatedArtifacts' });

  const canCopyFile = !!sourceFile && !targetFile;

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
          Legg til fil
        </Button>
      )}
      <FileBox file={targetFile} sx={{ gridColumn: '3' }} />
    </>
  );
};
