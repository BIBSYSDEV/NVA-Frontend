import { Box, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { KbsInstitution, KbsPatientCounts } from '../kbs.types';
import { getPatientsTotal } from '../_utils/kbs-helpers';
import { KbsTable } from './KbsTable';

interface KbsPatientsTableProps {
  year: number;
  institutions: KbsInstitution[];
  patientCounts: Partial<KbsPatientCounts>;
}

export const KbsPatientsTable = ({ year, institutions, patientCounts }: KbsPatientsTableProps) => {
  const { t } = useTranslation();
  const total = getPatientsTotal(patientCounts);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="subtitle1">{t('new_patients_for_year', { year })}</Typography>

      <KbsTable size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('common.institution')}</TableCell>
            <TableCell align="right">{t('patients')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {institutions.map((institution) => (
            <TableRow key={institution.id}>
              <TableCell>{institution.name}</TableCell>
              <TableCell align="right">{patientCounts[institution.id] ?? '-'}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>{t('total')}</TableCell>
            <TableCell align="right">{total ?? '-'}</TableCell>
          </TableRow>
        </TableBody>
      </KbsTable>
    </Box>
  );
};
