import { TableCell, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PercentageWithIcon } from '../../../../../components/_molecules/PercentageWithIcon';
import { StatusChip, StatusValue } from '../../../../../components/status-chips/StatusChip';
import { HorizontalBox } from '../../../../../components/styled/Wrappers';
import { NviPeriodReport } from '../../../../../types/nvi.types';
import { toDateString } from '../../../../../utils/date-helpers';
import { CenteredPercentageControlledCell } from '../../_styles/nvi-admin-table-styles';
import { getPercentageControlledReportingPeriods } from '../../_utils/nvi-admin-aggregations-helpers';

interface NviAdminReportingStatusRowProps {
  nviPeriodReport: NviPeriodReport;
}

export const NviAdminReportingPeriodsRow = ({ nviPeriodReport }: NviAdminReportingStatusRowProps) => {
  const { t } = useTranslation();
  const { period, totals } = nviPeriodReport;
  const startDateString = period.startDate
    ? `${toDateString(period.startDate)} (${new Date(period.startDate).toLocaleTimeString()})`
    : '?';
  const endDateString = period.reportingDate
    ? `${toDateString(period.reportingDate)} (${new Date(period.reportingDate).toLocaleTimeString()})`
    : '?';

  return (
    <TableRow sx={{ height: '4rem' }}>
      <TableCell>{period.publishingYear}</TableCell>
      <TableCell>{startDateString}</TableCell>
      <TableCell>{endDateString}</TableCell>
      <TableCell>{totals.undisputedTotalCount}</TableCell>
      <TableCell>{totals.validPoints}</TableCell>
      <CenteredPercentageControlledCell>
        <HorizontalBox sx={{ justifyContent: 'center' }}>
          <PercentageWithIcon
            displayPercentage={getPercentageControlledReportingPeriods(totals)}
            alternativeIfZero={'-'}
          />
        </HorizontalBox>
      </CenteredPercentageControlledCell>
      <TableCell>
        {<StatusChip status={StatusValue.WaitingToStart} text={t('nvi_period_status_not_opened')} />}
      </TableCell>
    </TableRow>
  );
};
