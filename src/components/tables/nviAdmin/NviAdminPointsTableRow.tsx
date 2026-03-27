import { TableCell, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  getNviApprovedCount,
  getNviCountApprovedByEverybody,
  getNviCountOthersMustApprove,
  getNviInstitutionName,
  getNviPointsForReporting,
  getNviSectorLabel,
} from '../../../helpers/nviAdminHelpers';
import { CenteredTableCell } from '../../../styles/tableStyles';
import { InstitutionReport } from '../../../types/nvi.types';
import { PercentageWithIcon } from '../../_atoms/PercentageWithIcon';
import { HorizontalBox } from '../../styled/Wrappers';

interface NviAdminPublicationPointsRowProps {
  report: InstitutionReport;
}

export const NviAdminPointsTableRow = ({ report }: NviAdminPublicationPointsRowProps) => {
  const { t } = useTranslation();
  const { id, institutionSummary } = report;
  const { totals } = institutionSummary;
  const approvedByEverybody = getNviCountApprovedByEverybody(report);
  const undisputedTotals = totals.undisputedTotalCount;
  const percentageControlled = undisputedTotals > 0 ? approvedByEverybody / undisputedTotals : 0;

  return (
    <TableRow key={id} sx={{ height: '4rem' }}>
      <TableCell>{getNviInstitutionName(report)}</TableCell>
      <TableCell>{getNviSectorLabel(report, t)}</TableCell>
      <CenteredTableCell>{getNviApprovedCount(report)}</CenteredTableCell>
      <CenteredTableCell>{getNviCountOthersMustApprove(report)}</CenteredTableCell>
      <CenteredTableCell>{approvedByEverybody}</CenteredTableCell>
      <CenteredTableCell>{getNviPointsForReporting(report)}</CenteredTableCell>
      <TableCell>
        <HorizontalBox sx={{ justifyContent: 'center' }}>
          <PercentageWithIcon displayPercentage={Math.floor(percentageControlled * 100)} alternativeIfZero={'-'} />
        </HorizontalBox>
      </TableCell>
    </TableRow>
  );
};
