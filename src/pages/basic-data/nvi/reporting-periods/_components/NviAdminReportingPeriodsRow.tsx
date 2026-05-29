import { TableCell, TableRow } from '@mui/material';
import { DateAndTimeDisplay } from '../../../../../components/_molecules/DateAndTimeDisplay';
import { PercentageWithIcon } from '../../../../../components/_molecules/PercentageWithIcon';
import { HorizontalBox } from '../../../../../components/styled/Wrappers';
import { CenteredTableCell } from '../../../../../components/tables/table-styles';
import { NviPeriod, NviPeriodReport, NviPeriodStatusEnum } from '../../../../../types/nvi.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { EditIconButton } from '../../../../messages/components/EditIconButton';
import { CenteredPercentageControlledCell } from '../../_styles/nvi-admin-table-styles';
import { getPercentageControlledReportingPeriod } from '../../_utils/nvi-admin-aggregations-helpers';
import { getNviPeriodStatus } from '../_utils/nvi-period-helpers';
import { NviPeriodStatusChip } from './NviPeriodStatusChip';

interface NviAdminReportingPeriodsRowProps {
  nviPeriodReport: NviPeriodReport;
  setNviPeriodToEdit: (period: NviPeriod | null) => void;
}

export const NviAdminReportingPeriodsRow = ({
  nviPeriodReport,
  setNviPeriodToEdit,
}: NviAdminReportingPeriodsRowProps) => {
  const { period, totals, byGlobalApprovalStatus } = nviPeriodReport;
  const status = getNviPeriodStatus(period);

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
      <CenteredTableCell>
        {/* We are showing different numbers based on period status, and this is the only status we have a number for yet */}
        {status === NviPeriodStatusEnum.ClosedPeriod ? byGlobalApprovalStatus.approved : '-'}
      </CenteredTableCell>
      <CenteredTableCell>
        {/* We are showing different numbers based on period status, and this is the only status we have a number for yet */}
        {status === NviPeriodStatusEnum.ClosedPeriod ? totals.validPoints : '-'}
      </CenteredTableCell>
      <CenteredPercentageControlledCell>
        <HorizontalBox sx={{ justifyContent: 'center' }}>
          <PercentageWithIcon
            displayPercentage={getPercentageControlledReportingPeriod(totals)}
            alternativeIfZero={'-'}
          />
        </HorizontalBox>
      </CenteredPercentageControlledCell>
      <TableCell>
        <NviPeriodStatusChip period={period} />
      </TableCell>
    </TableRow>
  );
};
