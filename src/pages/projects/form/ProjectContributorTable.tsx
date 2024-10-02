import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { alternatingTableRowColor } from '../../../themes/mainTheme';

interface ProjectContributorTableProps {
  children?: ReactNode;
}

export const ProjectContributorTable = ({ children }: ProjectContributorTableProps) => {
  const { t } = useTranslation();

  return (
    <TableContainer sx={{ mb: '0.5rem' }} component={Paper}>
      <Table size="small" sx={alternatingTableRowColor}>
        <TableHead>
          <TableRow>
            <TableCell>{t('common.name')}</TableCell>
            <TableCell>{t('common.role')}</TableCell>
            <TableCell>{t('common.affiliation')}</TableCell>
            <TableCell>{t('common.clear')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};
