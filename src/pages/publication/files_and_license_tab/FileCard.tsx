import React from 'react';
import styled from 'styled-components';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import { File } from '../../../types/license.types';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useTranslation } from 'react-i18next';
import FormCard from '../../../components/FormCard/FormCard';
import FormCardHeading from '../../../components/FormCard/FormCardHeading';

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

interface FileCardProps {
  file: File;
  removeFile: () => void;
  updateFile: (newFile: File) => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, removeFile, updateFile }) => {
  const { t } = useTranslation('publication');

  return (
    <FormCard>
      <FormCardHeading>{file.name}</FormCardHeading>
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
              value={file.isPublished}
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
            <TextField select variant="outlined" label={t('files_and_license.license')}></TextField>
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
    </FormCard>
  );
};

export default FileCard;
