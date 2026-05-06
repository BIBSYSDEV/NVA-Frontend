import { TableCell, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ViewContactInfoButton } from '../../../../../components/_atoms/buttons/ViewContactInfoButton';
import { PercentageWithIcon } from '../../../../../components/_molecules/PercentageWithIcon';
import { HorizontalBox } from '../../../../../components/styled/Wrappers';
import { CenteredTableCell } from '../../../../../components/tables/table-styles';
import { InstitutionReport } from '../../../../../types/nvi.types';
import { CenteredContactInformationCell, CenteredPercentageControlledCell } from '../../_styles/nvi-admin-table-styles';

import {
  getNviApprovedCount,
  getNviCandidatesCount,
  getNviInstitutionName,
  getNviRejectedCount,
  getNviSectorLabel,
  getNviTotalCount,
  getPercentageControlled,
} from '../../_utils/nvi-admin-aggregations-helpers';

interface NviAdminReportingStatusRowProps {
  report: InstitutionReport;
  onClickContactInformation: (institutionId: string) => void;
}

export const NviAdminReportingStatusRow = ({ report, onClickContactInformation }: NviAdminReportingStatusRowProps) => {
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
      <CenteredPercentageControlledCell>
        <HorizontalBox sx={{ justifyContent: 'center' }}>
          <PercentageWithIcon displayPercentage={Math.floor(percentageControlled * 100)} alternativeIfZero={'-'} />
        </HorizontalBox>
      </CenteredPercentageControlledCell>
      <CenteredContactInformationCell>
        <ViewContactInfoButton onClick={() => onClickContactInformation(report.institution.id)} />
      </CenteredContactInformationCell>
    </TableRow>
  );
};
