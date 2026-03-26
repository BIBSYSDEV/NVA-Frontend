import { TableCell, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PercentageWithIcon } from '../../../../components/atoms/PercentageWithIcon';
import { CenteredTableCell, HorizontalBox } from '../../../../components/styled/Wrappers';
import { InstitutionReport } from '../../../../types/nvi.types';

import {
  getNviApprovedCount,
  getNviCandidatesCount,
  getNviInstitutionName,
  getNviRejectedCount,
  getNviSectorLabel,
  getNviTotalCount,
} from './nviAdminHelpers';

interface NviAdminStatusPageRowProps {
  report: InstitutionReport;
}

export const NviAdminStatusPageRow = ({ report }: NviAdminStatusPageRowProps) => {
  const { t } = useTranslation();
  const { id, institutionSummary } = report;
  const { byLocalApprovalStatus, totals } = institutionSummary;
  const percentageControlled =
    totals.undisputedTotalCount > 0
      ? (byLocalApprovalStatus.approved + byLocalApprovalStatus.rejected) / totals.undisputedTotalCount
      : 0;

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
