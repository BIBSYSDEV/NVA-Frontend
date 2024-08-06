import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { Box, Typography } from '@mui/material';
import prettyBytes from 'pretty-bytes';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { TruncatableTypography } from '../../../components/TruncatableTypography';
import { AssociatedFile } from '../../../types/associatedArtifact.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { DeleteIconButton } from '../../messages/components/DeleteIconButton';
import { DownloadFileButton } from '../files_and_license_tab/DownloadFileButton';

interface FileNameProps {
  disabled: boolean;
  file: AssociatedFile;
  removeFile: () => void;
}

export const FileInfo = ({ disabled, file, removeFile }: FileNameProps) => {
  const { t } = useTranslation();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const toggleOpenConfirmDialog = () => setOpenConfirmDialog(!openConfirmDialog);

  return (
    <Box sx={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <InsertDriveFileOutlinedIcon sx={{ color: disabled ? 'grey.600' : '' }} />
      <Box sx={{ minWidth: '10rem' }}>
        <TruncatableTypography sx={{ fontWeight: 'bold', color: disabled ? 'grey.600' : '' }}>
          {file.name}
        </TruncatableTypography>
        <Typography sx={{ color: disabled ? 'grey.600' : '' }}>{prettyBytes(file.size)}</Typography>
      </Box>
      <Box sx={{ minWidth: '1.5rem' }}>
        <DownloadFileButton file={file} greyTones={disabled} />
      </Box>
      <DeleteIconButton
        data-testid={dataTestId.registrationWizard.files.deleteFile}
        onClick={disabled ? undefined : toggleOpenConfirmDialog}
        tooltip={t('registration.files_and_license.remove_file')}
        disabled={disabled}
      />
      <ConfirmDialog
        open={openConfirmDialog}
        title={t('registration.files_and_license.remove_file')}
        onAccept={() => {
          removeFile();
          toggleOpenConfirmDialog();
        }}
        onCancel={toggleOpenConfirmDialog}>
        <Typography>{t('registration.files_and_license.remove_file_description', { fileName: file.name })}</Typography>
      </ConfirmDialog>
    </Box>
  );
};
