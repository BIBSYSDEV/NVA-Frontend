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
import { PercentageWithIcon } from '../../../components/atoms/PercentageWithIcon';
import { NviStatusWrapper } from '../../messages/components/NviStatusWrapper';

export const NviAdminStatusPage = () => {
  const { t } = useTranslation();
  const mockData = [
    {
      id: 'test1',
      institution: 'Test1',
      sector: 'Høyere utdanning',
      candidate: 10,
      controlling: 8,
      approved: 1,
      rejected: 1,
      disputes: 1,
      total: 10,
      completed: false,
    },
    {
      id: 'test2',
      institution: 'Test2',
      sector: 'Statlig institutt',
      candidate: 15,
      controlling: 12,
      approved: 10,
      rejected: 2,
      disputes: 0,
      total: 0,
      completed: false,
    },
    {
      id: 'test3',
      institution: 'Test3',
      sector: 'Helseforetak',
      candidate: 8,
      controlling: 8,
      approved: 7,
      rejected: 1,
      disputes: 0,
      total: 8,
      completed: true,
    },
    {
      id: 'test4',
      institution: 'Test4',
      sector: 'Privat institusjon',
      candidate: 12,
      controlling: 9,
      approved: 8,
      rejected: 1,
      disputes: 0,
      total: 12,
      completed: false,
    },
    {
      id: 'test5',
      institution: 'Test5',
      sector: 'Fagskole',
      candidate: 6,
      controlling: 6,
      approved: 5,
      rejected: 1,
      disputes: 0,
      total: 6,
      completed: true,
    },
  ];

  return (
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
            </TableRow>
          </TableHead>
          <TableBody>
            {mockData.map((obj) => {
              const percentageControlled = obj.total > 0 ? (obj.approved + obj.rejected) / obj.total : 0;
              return (
                <TableRow key={obj.id} sx={{ height: '4rem' }}>
                  <TableCell>{obj.institution}</TableCell>
                  <TableCell>{obj.sector}</TableCell>
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
  );
};
