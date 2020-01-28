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
  Select,
  InputLabel,
} from '@material-ui/core';
import { File } from '../../../types/license.types';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useTranslation } from 'react-i18next';

const StyledTitle = styled.div`
  font-weight: bold;
`;
const StyledDescription = styled.div`
  font-style: italic;
`;
const StyledActions = styled.div``;

const StyledFormControl = styled(FormControl)`
  width: 30%;
  margin-top: 1rem;
`;

const StyledLicenseFormControl = styled(StyledFormControl)`
  margin-top: 2rem;
`;

interface FileCardProps {
  file: File;
  removeFile: () => void;
  updateFile: (newFile: File) => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, removeFile, updateFile }) => {
  const { t } = useTranslation('publication');

  return (
    <Box>
      <StyledTitle>{file.name}</StyledTitle>
      <StyledDescription>
        {t('files_and_license.uploaded_size', { size: Math.round(file.data.size / 1000) })}
      </StyledDescription>

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
        label={t('files_and_license.administrative_contract')}
      />

      {!file.administrativeContract && (
        <MuiBox display="flex" justifyContent="space-between">
          <StyledFormControl>
            <FormLabel component="legend">{t('files_and_license.select_version')}</FormLabel>
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
                label={t('files_and_license.accepted_version')}
              />
              <FormControlLabel
                value="published"
                control={<Radio color="primary" checked={!file.acceptedVersion} />}
                label={t('files_and_license.published_version')}
              />
            </RadioGroup>
          </StyledFormControl>

          <StyledFormControl>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                inputVariant="outlined"
                label={t('files_and_license.embargo_date')}
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
          </StyledFormControl>

          <StyledLicenseFormControl variant="outlined">
            <InputLabel>{t('files_and_license.license')}</InputLabel>
            <Select value={''} onChange={() => {}} labelWidth={50}></Select>
          </StyledLicenseFormControl>
        </MuiBox>
      )}

      <StyledActions>
        <Link href={file.uploadUrl} target="_blank">
          <Button color="primary" variant="contained">
            {t('common:preview')}
          </Button>
        </Link>
        <Button onClick={removeFile}>{t('common:remove')}</Button>
      </StyledActions>
    </Box>
  );
};

export default FileCard;
