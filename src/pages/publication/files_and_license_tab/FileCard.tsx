import React from 'react';
import Box from '../../../components/Box';
import styled from 'styled-components';
import { Button, Link, FormControlLabel, Checkbox } from '@material-ui/core';
import { File } from '../../../types/license.types';

const StyledTitle = styled.div`
  font-weight: bold;
`;
const StyledDescription = styled.div`
  font-style: italic;
`;
const StyledActions = styled.div``;

interface FileCardProps {
  file: File;
  removeFile: () => void;
  updateFile: (newFile: File) => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, removeFile, updateFile }) => {
  return (
    <Box>
      <StyledTitle>{file.name}</StyledTitle>
      <StyledDescription>Ferdig opplastet {file.data.size / 1000} kB</StyledDescription>

      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={file.administrativeContract}
            onChange={() =>
              updateFile({
                ...file,
                administrativeContract: !file.administrativeContract,
              })
            }
          />
        }
        label="Administrativ avtale"
      />

      <StyledActions>
        <Link href={file.uploadURL}>
          <Button color="primary" variant="contained">
            Forhåndsvis
          </Button>
        </Link>
        <Button onClick={removeFile}>Fjern</Button>
      </StyledActions>
    </Box>
  );
};

export default FileCard;
