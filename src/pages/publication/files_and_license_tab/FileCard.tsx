import React from 'react';
import Box from '../../../components/Box';
import styled from 'styled-components';
import {
  Button,
  Link,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Box as MuiBox,
} from '@material-ui/core';
import { File } from '../../../types/license.types';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

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
      <StyledDescription>Ferdig opplastet {Math.round(file.data.size / 1000)} kB</StyledDescription>

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

      {!file.administrativeContract && (
        <MuiBox display="flex" justifyContent="space-between">
          <FormControl component="fieldset">
            <FormLabel component="legend">Velg versjon</FormLabel>
            <RadioGroup
              aria-label="version"
              value={file.acceptedVersion}
              onChange={event =>
                updateFile({
                  ...file,
                  acceptedVersion: event.target.value === 'accepted',
                })
              }>
              <FormControlLabel
                value="accepted"
                control={<Radio color="primary" checked={file.acceptedVersion} />}
                label="Akseptert versjon"
              />
              <FormControlLabel
                value="published"
                control={<Radio color="primary" checked={!file.acceptedVersion} />}
                label="Publisert versjon"
              />
            </RadioGroup>
          </FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              inputVariant="outlined"
              label={'Utsattdato'}
              onChange={value =>
                updateFile({
                  ...file,
                  embargoDate: value,
                })
              }
              value={file.embargoDate}
              autoOk
            />
          </MuiPickersUtilsProvider>

          {/* TODO: License */}
        </MuiBox>
      )}

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
