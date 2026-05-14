import { TableCell, TableRow } from '@mui/material';
import { DateAndTimeWithIcons } from '../../../../../components/_molecules/DateAndTimeWithIcons';
import { HorizontalBox } from '../../../../../components/styled/Wrappers';
import { NviPeriod, NviPeriodReport } from '../../../../../types/nvi.types';
import { EditIconButton } from '../../../../messages/components/EditIconButton';

interface NviAdminReportingStatusRowProps {
  nviPeriodReport: NviPeriodReport;
  setNviPeriodToEdit: (val: NviPeriod | null) => void;
}

export const NviAdminReportingPeriodsRow = ({
  nviPeriodReport,
  setNviPeriodToEdit,
}: NviAdminReportingStatusRowProps) => {
  const { period } = nviPeriodReport;

  return (
    <TableRow sx={{ height: '4rem' }}>
      <TableCell>{period.publishingYear}</TableCell>
      <TableCell>{<DateAndTimeWithIcons date={period.startDate} />}</TableCell>
      <TableCell>
        <HorizontalBox sx={{ gap: '1rem' }}>
          <DateAndTimeWithIcons date={period.reportingDate} />
          <EditIconButton onClick={() => setNviPeriodToEdit(nviPeriodReport.period)} />
        </HorizontalBox>
      </TableCell>
    </TableRow>
  );
};
