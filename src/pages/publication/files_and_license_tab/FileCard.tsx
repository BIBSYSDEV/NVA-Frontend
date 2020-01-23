import React from 'react';
import Box from '../../../components/Box';
import styled from 'styled-components';
import { Button, Link } from '@material-ui/core';

const StyledTitle = styled.div`
  font-weight: bold;
`;
const StyledDescription = styled.div`
  font-style: italic;
`;

interface FileCardProps {
  file: any;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  return (
    <Box>
      <StyledTitle>{file.name}</StyledTitle>
      <StyledDescription>Ferdig opplastet {file.data.size / 1000} kB</StyledDescription>

      <Link href={file.uploadURL}>
        <Button color="primary" variant="contained">
          Forhåndsvis
        </Button>
      </Link>
      <Button>Fjern</Button>
    </Box>
  );
};

export default FileCard;
