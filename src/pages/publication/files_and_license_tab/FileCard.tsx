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
  TextField,
  MenuItem,
  ListItemText,
} from '@material-ui/core';
import { File, licenses, License } from '../../../types/file.types';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useTranslation } from 'react-i18next';
import ListItemIcon from '@material-ui/core/ListItemIcon';

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

const StyledFileInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledSelect = styled(TextField)`
  .MuiSelect-root {
    /* Ensure input height isn't expanded due to image content */
    height: 1.1875rem;
  }
`;

const StyledListItemText = styled(ListItemText)`
  margin-left: 0.5rem;
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
        <StyledFileInfo>
          <StyledFormControl>
            <FormLabel component="legend">{t('files_and_license.select_version')}</FormLabel>
            <RadioGroup
              aria-label="version"
              value={file.isPublished ? 'published' : 'accepted'}
              onChange={event =>
                updateFile({
                  ...file,
                  isPublished: event.target.value === 'published',
                })
              }>
              <FormControlLabel
                value="accepted"
                control={<Radio color="primary" checked={file.isPublished !== null && !file.isPublished} />}
                label={t('files_and_license.accepted_version')}
              />
              <FormControlLabel
                value="published"
                control={<Radio color="primary" checked={!!file.isPublished} />}
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

          <StyledFormControl>
            <StyledSelect
              select
              variant="outlined"
              value={file.license}
              label={t('files_and_license.license')}
              onChange={({ target: { value } }) => {
                updateFile({
                  ...file,
                  license: value,
                });
              }}>
              {licenses.map((license: License) => (
                <MenuItem key={license.name} value={license.name} divider dense>
                  <ListItemIcon>
                    <img src={license.image} alt={license.name} />
                  </ListItemIcon>
                  <StyledListItemText>{license.name}</StyledListItemText>
                </MenuItem>
              ))}
            </StyledSelect>
          </StyledFormControl>
        </StyledFileInfo>
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
