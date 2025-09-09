import { Box, BoxProps, Typography } from '@mui/material';
import prettyBytes from 'pretty-bytes';
import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FileUploaderInfo } from '../../pages/public_registration/public_files/FileUploaderInfo';
import { AssociatedFile } from '../../types/associatedArtifact.types';
import { Registration } from '../../types/registration.types';
import { getAssociatedFiles } from '../../utils/registration-helpers';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

export const MergeResultsWizardFilesTab = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<Registration>();
  const targetAssociatedArtifacts = useWatch({ name: 'associatedArtifacts', control }) ?? [];
  const targetFiles = getAssociatedFiles(targetAssociatedArtifacts);

  const { sourceResult } = useContext(MergeResultsWizardContext);
  const sourceAssociatedArtifacts = sourceResult.associatedArtifacts ?? [];
  const sourceFiles = getAssociatedFiles(sourceAssociatedArtifacts);

  return (
    <>
      {targetFiles.map((file) => (
        <CompareFiles key={file.identifier} targetFile={file} />
      ))}

      {sourceFiles.map((file) => (
        <CompareFiles key={file.identifier} sourceFile={file} />
      ))}
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
  return (
    <>
      <FileBox file={sourceFile} />
      <FileBox file={targetFile} sx={{ gridColumn: '3' }} />
    </>
  );
};
