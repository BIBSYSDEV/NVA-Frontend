import { TableCell, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { InstitutionReport } from '../../../../types/nvi.types';
import { PercentageWithIcon } from '../../../_molecules/PercentageWithIcon';
import { HorizontalBox } from '../../../styled/Wrappers';
import { CenteredTableCell } from '../../../tables/table-styles';

import {
  getNviApprovedCount,
  getNviCandidatesCount,
  getNviInstitutionName,
  getNviRejectedCount,
  getNviSectorLabel,
  getNviTotalCount,
  getPercentageControlled,
} from '../utils/nvi-admin-aggregations-helpers';

interface NviAdminReportingStatusRowProps {
  report: InstitutionReport;
}

export const NviAdminReportingStatusRow = ({ report }: NviAdminReportingStatusRowProps) => {
  const { t } = useTranslation();
  const { id, institutionSummary } = report;
  const { byLocalApprovalStatus, totals } = institutionSummary;
  const percentageControlled = getPercentageControlled(report);

  return (
    <TableRow key={id} sx={{ height: '4rem' }}>
      <TableCell>{getNviInstitutionName(report)}</TableCell>
      <TableCell>{getNviSectorLabel(report, t)}</TableCell>
      <CenteredTableCell>{getNviCandidatesCount(report)}</CenteredTableCell>
      <CenteredTableCell>{byLocalApprovalStatus.pending}</CenteredTableCell>
      <CenteredTableCell>{getNviApprovedCount(report)}</CenteredTableCell>
      <CenteredTableCell>{getNviRejectedCount(report)}</CenteredTableCell>
      <CenteredTableCell>{totals.disputedCount}</CenteredTableCell>
      <CenteredTableCell>{getNviTotalCount(report)}</CenteredTableCell>
      <CenteredTableCell>
        <HorizontalBox sx={{ justifyContent: 'center' }}>
          <PercentageWithIcon displayPercentage={Math.floor(percentageControlled * 100)} alternativeIfZero={'-'} />
        </HorizontalBox>
      </CenteredTableCell>
    </TableRow>
  );
};
