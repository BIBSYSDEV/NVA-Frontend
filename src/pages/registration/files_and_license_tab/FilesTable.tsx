import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import prettyBytes from 'pretty-bytes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AssociatedFile } from '../../../types/associatedArtifact.types';
import { ConfirmDialog } from '../../../components/ConfirmDialog';

interface FilesTableProps {
  files: AssociatedFile[];
  removeFile: () => void;
}

export const FilesTable = ({ files, removeFile }: FilesTableProps) => {
  const { t } = useTranslation();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const toggleOpenConfirmDialog = () => setOpenConfirmDialog(!openConfirmDialog);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ fontWeight: 'bold' }}>
          <TableRow>
            <TableCell>
              <Typography>{t('common.name')}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{t('registration.files_and_license.size')}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{t('common.version')}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{t('registration.files_and_license.embargo')}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{t('registration.files_and_license.licens')}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{t('common.actions')}</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.identifier}>
              <TableCell>{file.name}</TableCell>
              <TableCell>{prettyBytes(file.size)}</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Embargo</TableCell>
              <TableCell>License</TableCell>
              <TableCell>
                <Button color="error" startIcon={<DeleteIcon />} onClick={toggleOpenConfirmDialog} />
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
