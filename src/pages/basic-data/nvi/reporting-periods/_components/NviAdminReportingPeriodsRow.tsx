import { TableCell, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DateAndTimeDisplay } from '../../../../../components/_molecules/DateAndTimeDisplay';
import { StatusChip, StatusValue } from '../../../../../components/status-chips/StatusChip';
import { HorizontalBox } from '../../../../../components/styled/Wrappers';
import { NviPeriod, NviPeriodReport } from '../../../../../types/nvi.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { EditIconButton } from '../../../../messages/components/EditIconButton';

interface NviAdminReportingPeriodsRowProps {
  nviPeriodReport: NviPeriodReport;
  setNviPeriodToEdit: (val: NviPeriod | null) => void;
}

export const NviAdminReportingPeriodsRow = ({
  nviPeriodReport,
  setNviPeriodToEdit,
}: NviAdminReportingPeriodsRowProps) => {
  const { t } = useTranslation();
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
        <StatusChip status={StatusValue.WaitingToStart} text={t('nvi_period_status_not_opened')} />
      </TableCell>
    </TableRow>
  );
};
