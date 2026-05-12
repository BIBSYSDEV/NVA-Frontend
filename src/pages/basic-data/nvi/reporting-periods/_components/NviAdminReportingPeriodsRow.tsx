import { TableCell, TableRow } from '@mui/material';
import { NviPeriod } from '../../../../../types/nvi.types';
import { toDateString } from '../../../../../utils/date-helpers';

interface NviAdminReportingStatusRowProps {
  nviPeriod: NviPeriod;
}

export const NviAdminReportingPeriodsRow = ({ nviPeriod }: NviAdminReportingStatusRowProps) => {
  const startDateString = nviPeriod.startDate
    ? `${toDateString(nviPeriod.startDate)} (${new Date(nviPeriod.startDate).toLocaleTimeString()})`
    : '?';
  const endDateString = nviPeriod.reportingDate
    ? `${toDateString(nviPeriod.reportingDate)} (${new Date(nviPeriod.reportingDate).toLocaleTimeString()})`
    : '?';

  return (
    <TableRow sx={{ height: '4rem' }}>
      <TableCell>{nviPeriod.publishingYear}</TableCell>
      <TableCell>{startDateString}</TableCell>
      <TableCell>{endDateString}</TableCell>
      <TableCell>?</TableCell>
      <TableCell>?</TableCell>
      <TableCell>?</TableCell>
      <TableCell>?</TableCell>
    </TableRow>
  );
};
