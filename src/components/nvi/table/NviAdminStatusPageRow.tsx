import { TableCell, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ViewContactInfoButton } from '../../buttons/ViewContactInfoButton';
import { PercentageWithIcon } from '../../_molecules/PercentageWithIcon';
import { HorizontalBox } from '../../styled/Wrappers';
import { CenteredTableCell } from '../../../styles/table-styles';
import { InstitutionReport } from '../../../types/nvi.types';

import {
  getNviApprovedCount,
  getNviCandidatesCount,
  getNviInstitutionName,
  getNviRejectedCount,
  getNviSectorLabel,
  getNviTotalCount,
} from '../../../pages/basic_data/app_admin/nviAdmin/nviAdminHelpers';
import { CenteredContactInformationCell, CenteredPercentageControlledCell } from './nvi-table-styles';

interface NviAdminStatusPageRowProps {
  report: InstitutionReport;
  onClickContactInformation: (institutionId: string) => void;
}

export const NviAdminStatusPageRow = ({ report, onClickContactInformation }: NviAdminStatusPageRowProps) => {
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
