import { TableCell, TableRow } from '@mui/material';
import { DateAndTimeDisplay } from '../../../../../components/_molecules/DateAndTimeDisplay';
import { HorizontalBox } from '../../../../../components/styled/Wrappers';
import { NviPeriod, NviPeriodReport } from '../../../../../types/nvi.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { EditIconButton } from '../../../../messages/components/EditIconButton';
import { NviPeriodStatusChip } from './NviPeriodStatusChip';

interface NviAdminReportingPeriodsRowProps {
  nviPeriodReport: NviPeriodReport;
  setNviPeriodToEdit: (period: NviPeriod | null) => void;
}

export const NviAdminReportingPeriodsRow = ({
  nviPeriodReport,
  setNviPeriodToEdit,
}: NviAdminReportingPeriodsRowProps) => {
  const { period } = nviPeriodReport;

  return (
    <TableRow sx={{ height: '4rem' }}>
      <TableCell>{period.publishingYear}</TableCell>
      <TableCell>
        <DateAndTimeDisplay date={period.startDate} />
      </TableCell>
      <TableCell>
        <HorizontalBox sx={{ gap: '1rem' }}>
          <DateAndTimeDisplay date={period.reportingDate} />
          <EditIconButton
            data-testid={dataTestId.basicData.nviPeriod.editNviPeriodButton(nviPeriodReport.id)}
            onClick={() => setNviPeriodToEdit(nviPeriodReport.period)}
          />
        </HorizontalBox>
      </TableCell>
      <TableCell>
        <NviPeriodStatusChip startDate={period.startDate} endDate={period.reportingDate} />
      </TableCell>
    </TableRow>
  );
};
