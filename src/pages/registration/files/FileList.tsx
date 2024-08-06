import { Box, Theme, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AssociatedFile, Uppy } from '../../../types/associatedArtifact.types';
import { FileTable } from './FileTable';
import { MobileFormattedFiles } from './MobileFormattedFiles';

interface FileListProps {
  title: string;
  files: AssociatedFile[];
  uppy: Uppy;
  remove: (index: number) => any;
  baseFieldName: string;
  archived?: boolean;
}

export const FileList = ({ title, ...props }: FileListProps) => {
  const mobileScreenWidth = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
      <Typography component="h3" variant="h4">
        {title}
      </Typography>
      {mobileScreenWidth ? <MobileFormattedFiles /> : <FileTable {...props} />}
    </Box>
  );
};
