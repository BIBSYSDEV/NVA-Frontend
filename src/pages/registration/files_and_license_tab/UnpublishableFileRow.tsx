import { Box, Checkbox, IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import prettyBytes from 'pretty-bytes';
import { Field, FieldProps, useFormikContext } from 'formik';
import { AssociatedFile, AssociatedFileType } from '../../../types/associatedArtifact.types';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { SpecificFileFieldNames } from '../../../types/publicationFieldNames';
import { dataTestId } from '../../../utils/dataTestIds';
import { TruncatableTypography } from '../../../components/TruncatableTypography';

interface UnpublishableFileRowProps {
  file: AssociatedFile;
  removeFile: () => void;
  toggleLicenseModal: () => void;
  baseFieldName: string;
}

export const UnpublishableFileRow = ({ file, removeFile, baseFieldName }: UnpublishableFileRowProps) => {
  const { t } = useTranslation();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const toggleOpenConfirmDialog = () => setOpenConfirmDialog(!openConfirmDialog);
  const { setFieldValue } = useFormikContext();

  return (
    <TableRow data-testid={dataTestId.registrationWizard.files.fileRow}>
      <TableCell sx={{ minWidth: '13rem' }}>
        <Box sx={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <TruncatableTypography>{file.name}</TruncatableTypography>
          <Tooltip title={t('registration.files_and_license.remove_file')}>
            <IconButton onClick={toggleOpenConfirmDialog}>
              <CancelIcon color="error" />
            </IconButton>
          </Tooltip>
          <ConfirmDialog
            open={openConfirmDialog}
            title={t('registration.files_and_license.remove_file')}
            onAccept={() => {
              removeFile();
              toggleOpenConfirmDialog();
            }}
            onCancel={toggleOpenConfirmDialog}>
            <Typography>
              {t('registration.files_and_license.remove_file_description', { fileName: file.name })}
            </Typography>
          </ConfirmDialog>
        </Box>
      </TableCell>

      <TableCell sx={{ minWidth: '5.5rem' }}>{prettyBytes(file.size)}</TableCell>

      <TableCell>
        <Field name={`${baseFieldName}.${SpecificFileFieldNames.AdministrativeAgreement}`}>
          {({ field }: FieldProps) => (
            <Tooltip title={t('registration.files_and_license.administrative_contract')}>
              <Checkbox
                {...field}
                data-testid={dataTestId.registrationWizard.files.administrativeAgreement}
                checked={field.value}
                onChange={(event) => {
                  const newAssociatedFileType: AssociatedFileType =
                    field.value === true ? 'UnpublishedFile' : 'UnpublishableFile';
                  setFieldValue(`${baseFieldName}.${SpecificFileFieldNames.Type}`, newAssociatedFileType);

                  field.onChange(event);
                  setFieldValue(`${baseFieldName}.${SpecificFileFieldNames.PublisherAuthority}`, null);
                  setFieldValue(`${baseFieldName}.${SpecificFileFieldNames.License}`, null);
                  setFieldValue(`${baseFieldName}.${SpecificFileFieldNames.EmbargoDate}`, null);
                }}
              />
            </Tooltip>
          )}
        </Field>
      </TableCell>
    </TableRow>
  );
};
