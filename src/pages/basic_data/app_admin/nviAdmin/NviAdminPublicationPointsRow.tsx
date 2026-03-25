import { TableCell, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PercentageWithIcon } from '../../../../components/atoms/PercentageWithIcon';
import { HorizontalBox } from '../../../../components/styled/Wrappers';
import { InstitutionReport } from '../../../../types/nvi.types';
import {
  getNviApprovedByEverybody,
  getNviApprovedCount,
  getNviCountOthersMustApprove,
  getNviInstitutionName,
  getNviSectorLabel,
  getNviValidPoints,
} from './nviAdminHelpers';

interface NviAdminPublicationPointsRowProps {
  report: InstitutionReport;
}

export const NviAdminPublicationPointsRow = ({ report }: NviAdminPublicationPointsRowProps) => {
  const { t } = useTranslation();
  const { id, institutionSummary } = report;
  const { totals } = institutionSummary;
  const approvedByEverybody = getNviApprovedByEverybody(report);
  const undisputedTotals = totals.undisputedTotalCount;
  const percentageControlled = undisputedTotals > 0 ? approvedByEverybody / undisputedTotals : 0;

  return (
    <TableRow key={id} sx={{ height: '4rem' }}>
      <TableCell>{getNviInstitutionName(report)}</TableCell>
      <TableCell>{getNviSectorLabel(report, t)}</TableCell>
      <TableCell align="center">{getNviApprovedCount(report)}</TableCell>
      <TableCell align="center">{getNviCountOthersMustApprove(report)}</TableCell>
      <TableCell align="center">{approvedByEverybody}</TableCell>
      <TableCell align="center">{getNviValidPoints(report)}</TableCell>
      <TableCell>
        <HorizontalBox sx={{ justifyContent: 'center' }}>
          <PercentageWithIcon displayPercentage={Math.floor(percentageControlled * 100)} alternativeIfZero={'-'} />
        </HorizontalBox>
      </TableCell>
    </TableRow>
  );
};
