import { TableCell, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PercentageWithIcon } from '../../../../components/_atoms/PercentageWithIcon';
import { HorizontalBox } from '../../../../components/styled/Wrappers';
import { CenteredTableCell } from '../../../../styles/table-styles';
import { InstitutionReport } from '../../../../types/nvi.types';
import {
  getNviApprovedByEverybody,
  getNviApprovedCount,
  getNviCountOthersMustApprove,
  getNviInstitutionName,
  getNviSectorLabel,
  getNviValidPoints,
  getPercentageControlledPublicationPoints,
} from './nviAdminHelpers';

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
      <TableCell>
        <HorizontalBox sx={{ justifyContent: 'center' }}>
          <PercentageWithIcon displayPercentage={Math.floor(percentageControlled * 100)} alternativeIfZero={'-'} />
        </HorizontalBox>
      </TableCell>
    </TableRow>
  );
};
