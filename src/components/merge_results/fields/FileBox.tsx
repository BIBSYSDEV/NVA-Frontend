import { Box, BoxProps, Typography } from '@mui/material';
import prettyBytes from 'pretty-bytes';
import { FileUploaderInfo } from '../../../pages/public_registration/public_files/FileUploaderInfo';
import { AssociatedFile } from '../../../types/associatedArtifact.types';

interface FileBoxProps extends BoxProps {
  file?: AssociatedFile;
}

export const FileBox = ({ file, sx }: FileBoxProps) => {
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
