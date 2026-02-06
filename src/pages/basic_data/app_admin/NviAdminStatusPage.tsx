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
                <TableCell>{t('common.institution')}</TableCell>
                <TableCell>{t('sector')}</TableCell>
                <TableCell>{t('candidate')}</TableCell>
                <TableCell>{t('controlling')}</TableCell>
                <TableCell>{t('approved')}</TableCell>
                <TableCell>{t('rejected')}</TableCell>
                <TableCell>{t('disputes')}</TableCell>
                <TableCell>{t('common.total_number')}</TableCell>
                <TableCell>{t('percentage_controlled')}</TableCell>
                <TableCell>{t('internal_nvi_status')}</TableCell>
                <TableCell>
                  <Box component="span" sx={visuallyHidden}>
                    {t('view_contact_information')}
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
