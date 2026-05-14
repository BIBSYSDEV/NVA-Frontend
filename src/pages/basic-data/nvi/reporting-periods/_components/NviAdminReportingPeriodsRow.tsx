import { TableCell, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DateAndTimeWithIcons } from '../../../../../components/_molecules/DateAndTimeWithIcons';
import { PercentageWithIcon } from '../../../../../components/_molecules/PercentageWithIcon';
import { StatusChip, StatusValue } from '../../../../../components/status-chips/StatusChip';
import { HorizontalBox } from '../../../../../components/styled/Wrappers';
import { NviPeriod, NviPeriodReport } from '../../../../../types/nvi.types';
import { EditIconButton } from '../../../../messages/components/EditIconButton';
import { CenteredPercentageControlledCell } from '../../_styles/nvi-admin-table-styles';
import { getPercentageControlledReportingPeriods } from '../../_utils/nvi-admin-aggregations-helpers';

interface NviAdminReportingStatusRowProps {
  nviPeriodReport: NviPeriodReport;
  setNviPeriodToEdit: (val: NviPeriod | null) => void;
}

export const NviAdminReportingPeriodsRow = ({
  nviPeriodReport,
  setNviPeriodToEdit,
}: NviAdminReportingStatusRowProps) => {
  const { t } = useTranslation();
  const { period, totals } = nviPeriodReport;

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
