import { TableCell, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { InstitutionReport } from '../../../../types/nvi.types';
import { PercentageWithIcon } from '../../../_molecules/PercentageWithIcon';
import { HorizontalBox } from '../../../styled/Wrappers';
import { CenteredTableCell } from '../../../tables/table-styles';
import { CenteredPercentageControlledCell } from '../nvi-table-styles';
import {
  getNviApprovedByEverybody,
  getNviApprovedCount,
  getNviCountOthersMustApprove,
  getNviInstitutionName,
  getNviSectorLabel,
  getNviValidPoints,
  getPercentageControlledPublicationPoints,
} from '../utils/nvi-admin-aggregations-helpers';

interface NviAdminPublicationPointsRowProps {
  report: InstitutionReport;
}

export const NviAdminPublicationPointsRow = ({ report }: NviAdminPublicationPointsRowProps) => {
  const { t } = useTranslation();
  const percentageControlled = getPercentageControlledPublicationPoints(report);

  return (
    <TableRow key={report.id} sx={{ height: '4rem' }}>
      <TableCell>{getNviInstitutionName(report)}</TableCell>
      <TableCell>{getNviSectorLabel(report, t)}</TableCell>
      <CenteredTableCell>{getNviApprovedCount(report)}</CenteredTableCell>
      <CenteredTableCell>{getNviCountOthersMustApprove(report)}</CenteredTableCell>
      <CenteredTableCell>{getNviApprovedByEverybody(report)}</CenteredTableCell>
      <CenteredTableCell>{getNviValidPoints(report)}</CenteredTableCell>
      <CenteredPercentageControlledCell>
        <HorizontalBox sx={{ justifyContent: 'center' }}>
          <PercentageWithIcon displayPercentage={Math.floor(percentageControlled * 100)} alternativeIfZero={'-'} />
        </HorizontalBox>
      </CenteredPercentageControlledCell>
    </TableRow>
  );
};
