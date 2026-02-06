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
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { PercentageWithIcon } from '../../../components/atoms/PercentageWithIcon';
import { NviStatusWrapper } from '../../messages/components/NviStatusWrapper';

export const NviAdminStatusPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedSector = searchParams.get('sector');
  const institutionSearch = searchParams.get('institution');

  const mockData = [
    {
      id: 'uio',
      institution: 'Universitetet i Oslo',
      sector: 'UHI',
      candidate: 10,
      controlling: 8,
      approved: 1,
      rejected: 1,
      disputes: 1,
      total: 10,
      percentageControlled: '80%',
      completed: false,
    },
    {
      id: 'ntnu',
      institution: 'Norges teknisk-naturvitenskapelige universitet',
      sector: 'UHI',
      candidate: 15,
      controlling: 12,
      approved: 10,
      rejected: 2,
      disputes: 0,
      total: 15,
      percentageControlled: '80%',
      completed: false,
    },
    {
      id: 'uib',
      institution: 'Universitetet i Bergen',
      sector: 'HEALTH',
      candidate: 8,
      controlling: 8,
      approved: 7,
      rejected: 1,
      disputes: 0,
      total: 8,
      percentageControlled: '100%',
      completed: true,
    },
    {
      id: 'uit',
      institution: 'Universitetet i Tromsø',
      sector: 'UHI',
      candidate: 12,
      controlling: 9,
      approved: 8,
      rejected: 1,
      disputes: 0,
      total: 12,
      percentageControlled: '75%',
      completed: false,
    },
    {
      id: 'oslomet',
      institution: 'OsloMet – storbyuniversitetet',
      sector: 'UHI',
      candidate: 6,
      controlling: 6,
      approved: 5,
      rejected: 1,
      disputes: 0,
      total: 6,
      percentageControlled: '100%',
      completed: true,
    },
  ]
    .filter((obj) => selectedSector === null || obj.sector === selectedSector)
    .filter((obj) => {
      if (institutionSearch === null) {
        return true;
      }
      const trimmedSearch = institutionSearch.trim().toLowerCase();
      const trimmedInstitution = obj.institution.trim().toLowerCase();
      return trimmedSearch === trimmedInstitution || trimmedInstitution.includes(trimmedSearch);
    });

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
        yearSelector
        sectorSelector
        institutionSearch>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.map((obj) => {
                const percentageControlled = obj.total > 0 ? (obj.approved + obj.rejected) / obj.total : 0;
                return (
                  <TableRow key={obj.id} sx={{ height: '4rem' }}>
                    <TableCell>{obj.institution}</TableCell>
                    <TableCell>{t(`basic_data.institutions.sector_values.${obj.sector}` as any)}</TableCell>
                    <TableCell align="center">{obj.candidate}</TableCell>
                    <TableCell align="center">{obj.controlling}</TableCell>
                    <TableCell align="center">{obj.approved}</TableCell>
                    <TableCell align="center">{obj.rejected}</TableCell>
                    <TableCell align="center">{obj.disputes}</TableCell>
                    <TableCell align="center">{obj.total}</TableCell>
                    <TableCell align="center">
                      <PercentageWithIcon
                        warningThresholdMinimum={30}
                        successThresholdMinimum={100}
                        displayPercentage={Math.round(percentageControlled * 100)}
                        alternativeIfZero={'-'}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </NviStatusWrapper>
    </div>
  );
};
