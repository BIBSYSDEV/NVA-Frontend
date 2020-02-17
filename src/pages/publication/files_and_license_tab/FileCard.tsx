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
  MenuItem,
  IconButton,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { File, licenses, License } from '../../../types/file.types';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useTranslation } from 'react-i18next';
import StyledCard from '../../../components/Card';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HelpIcon from '@material-ui/icons/Help';
import SubHeading from '../../../components/SubHeading';
import DeleteIcon from '@material-ui/icons/Delete';

const StyledDescription = styled.div`
  font-style: italic;
`;

const StyledPreview = styled(Link)`
  margin-right: 1rem;
`;

const StyledFormControl = styled(FormControl)`
  width: 30%;
  margin-top: 1rem;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.sm}px`}) {
    width: 100%;
  }
`;

const StyledFileInfo = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.sm}px`}) {
    flex-direction: column;
  }
`;

const StyledSelect = styled(TextField)`
  .MuiSelect-root {
    /* Ensure input height isn't expanded due to image content */
    height: 1.1875rem;
  }
`;

const StyledLicenseName = styled(Typography)`
  margin-left: 0.5rem;
`;

const StyledVerticalAlign = styled.div`
  display: flex;
  align-items: center;
`;

const StyledActions = styled.div`
  margin-top: 1rem;
`;

interface FileCardProps {
  file: File;
  removeFile: () => void;
  updateFile?: (newFile: File) => void;
  toggleLicenseModal?: () => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, removeFile, updateFile, toggleLicenseModal }) => {
  const { t } = useTranslation('publication');

  return (
    <StyledCard data-testid="uploaded-file-card">
      <SubHeading>{file.name}</SubHeading>
      <StyledDescription>
        {t('files_and_license.uploaded_size', { size: Math.round(file.data.size / 1000) })}
      </StyledDescription>

      {updateFile && (
        <>
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
                    format={'dd.MM.yyyy'}
                  />
                </MuiPickersUtilsProvider>
              </StyledFormControl>

              <StyledFormControl>
                <StyledVerticalAlign>
                  <StyledSelect
                    select
                    fullWidth
                    SelectProps={{
                      renderValue: (option: any) => {
                        const selectedLicense = licenses.find((license: License) => license.name === option);
                        return selectedLicense ? (
                          <StyledVerticalAlign>
                            <img src={selectedLicense.image} alt={selectedLicense.name} />
                            <StyledLicenseName display="inline" variant="body1">
                              {option}
                            </StyledLicenseName>
                          </StyledVerticalAlign>
                        ) : null;
                      },
                    }}
                    variant="outlined"
                    value={file.license}
                    label={t('files_and_license.license')}
                    onChange={({ target: { value } }) =>
                      updateFile({
                        ...file,
                        license: value,
                      })
                    }>
                    {licenses.map((license: License) => (
                      <MenuItem key={license.name} value={license.name} divider dense>
                        <ListItemIcon>
                          <img src={license.image} alt={license.name} />
                        </ListItemIcon>
                        <ListItemText>
                          <StyledLicenseName variant="body1">{license.name}</StyledLicenseName>
                        </ListItemText>
                      </MenuItem>
                    ))}
                  </StyledSelect>
                  <IconButton size="small" onClick={toggleLicenseModal}>
                    <HelpIcon />
                  </IconButton>
                </StyledVerticalAlign>
              </StyledFormControl>
            </StyledFileInfo>
          )}
        </>
      )}

      <StyledActions>
        {file.preview && (
          <StyledPreview href={file.preview} target="_blank">
            <Button color="primary" variant="contained">
              {t('common:preview')}
            </Button>
          </StyledPreview>
        )}
        <Button variant="contained" color="secondary" onClick={removeFile}>
          <DeleteIcon />
          {t('common:remove')}
        </Button>
      </StyledActions>
    </StyledCard>
  );
};

export default FileCard;
