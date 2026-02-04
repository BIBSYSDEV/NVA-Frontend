import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Trans, useTranslation } from 'react-i18next';
import { NviStatusWrapper } from '../../messages/components/NviStatusWrapper';

export const NviAdminStatusPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <NviStatusWrapper
        headline={t('basic_data.nvi.reporting_status')}
        topView={
          <Box sx={{ mb: '1rem' }}>
            <Trans
              t={t}
              i18nKey="basic_data.nvi.reporting_status_description"
              components={{ p: <Typography gutterBottom /> }}
            />
          </Box>
        }
        yearSelector>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ whiteSpace: 'nowrap', bgcolor: 'white' }}>
                <TableCell>{t('basic_data.nvi.institution')}</TableCell>
                <TableCell>{t('basic_data.nvi.sector')}</TableCell>
                <TableCell>{t('basic_data.nvi.candidate')}</TableCell>
                <TableCell>{t('basic_data.nvi.controlling')}</TableCell>
                <TableCell>{t('basic_data.nvi.approved')}</TableCell>
                <TableCell>{t('basic_data.nvi.rejected')}</TableCell>
                <TableCell>{t('basic_data.nvi.disputes')}</TableCell>
                <TableCell>{t('basic_data.nvi.total')}</TableCell>
                <TableCell>{t('basic_data.nvi.percentage_controlled')}</TableCell>
                <TableCell>{t('basic_data.nvi.internal_nvi_status')}</TableCell>
                <TableCell>
                  <Box component="span" sx={visuallyHidden}>
                    {t('basic_data.nvi.view_contact_information')}
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody></TableBody>
          </Table>
        </TableContainer>
      </NviStatusWrapper>
    </div>
  );
};
