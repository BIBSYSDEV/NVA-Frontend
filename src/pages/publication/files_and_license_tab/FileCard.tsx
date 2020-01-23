import React from 'react';
import Box from '../../../components/Box';
import styled from 'styled-components';
import { Button, Link, FormControlLabel, Checkbox } from '@material-ui/core';
import { File } from '../../../types/license.types';
import { Field } from 'formik';

const StyledTitle = styled.div`
  font-weight: bold;
`;
const StyledDescription = styled.div`
  font-style: italic;
`;
const StyledActions = styled.div``;

interface FileCardProps {
  file: File;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  return (
    <Box>
      <StyledTitle>{file.name}</StyledTitle>
      <StyledDescription>Ferdig opplastet {file.data.size / 1000} kB</StyledDescription>
      <Field>
        {() => (
          <FormControlLabel
            control={<Checkbox checked={false} onChange={() => console.log('click')} value="checkedA" />}
            label="Administrativ avtale"
          />
        )}
      </Field>
      <StyledActions>
        <Link href={file.uploadURL}>
          <Button color="primary" variant="contained">
            Forhåndsvis
          </Button>
        </Link>
        <Button>Fjern</Button>
      </StyledActions>
    </Box>
  );
};

export default FileCard;
