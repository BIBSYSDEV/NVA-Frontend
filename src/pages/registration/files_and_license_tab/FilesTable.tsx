import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const FilesTable = () => {
  const { t } = useTranslation();
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ fontWeight: 'bold' }}>
          <TableRow>
            <TableCell>
              <Typography>{t('registration.files_and_license.files')}</Typography>
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
        <TableBody></TableBody>
      </Table>
    </TableContainer>
  );
};
