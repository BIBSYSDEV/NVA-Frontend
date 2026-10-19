import CheckIcon from '@mui/icons-material/Check';
import { Box, Button, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KbsInstitution, KbsPatientCounts } from '../kbs.types';
import { getPatientsTotal, hasPatientCountForAllInstitutions } from '../_utils/kbs-helpers';
import { KbsTable } from './KbsTable';

const wholeNumberPattern = /^\d+$/;

interface KbsPatientsFormProps {
  year: number;
  institutions: KbsInstitution[];
  onDeliver: (patientCounts: KbsPatientCounts) => void;
}

export const KbsPatientsForm = ({ year, institutions, onDeliver }: KbsPatientsFormProps) => {
  const { t } = useTranslation();
  const [patientCounts, setPatientCounts] = useState<Partial<KbsPatientCounts>>({});

  const total = getPatientsTotal(patientCounts);
  const canDeliver = hasPatientCountForAllInstitutions(institutions, patientCounts);

  const updatePatientCount = (institutionId: string, value: string) => {
    if (value === '') {
      setPatientCounts(({ [institutionId]: _removed, ...otherCounts }) => otherCounts);
    } else if (wholeNumberPattern.test(value)) {
      setPatientCounts((counts) => ({ ...counts, [institutionId]: Number(value) }));
    }
  };

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
              <TableCell align="right">
                <TextField
                  size="small"
                  sx={{
                    width: '6.5rem',
                    '& .MuiInputBase-input': { py: '0.25rem', px: '0.5rem', textAlign: 'right' },
                    '& .MuiInputBase-input::placeholder': { textAlign: 'center' },
                  }}
                  placeholder={t('enter_number')}
                  value={patientCounts[institution.id]?.toString() ?? ''}
                  onChange={(event) => updatePatientCount(institution.id, event.target.value)}
                  slotProps={{
                    htmlInput: {
                      inputMode: 'numeric',
                      'aria-label': t('patients_at_institution', { institution: institution.name }),
                    },
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>{t('total')}</TableCell>
            <TableCell align="right">{total ?? '-'}</TableCell>
          </TableRow>
        </TableBody>
      </KbsTable>

      <Button
        variant="contained"
        color="secondary"
        startIcon={<CheckIcon />}
        disabled={!canDeliver}
        onClick={() => canDeliver && onDeliver(patientCounts)}
        sx={{ alignSelf: 'center' }}>
        {t('deliver')}
      </Button>
    </Box>
  );
};
