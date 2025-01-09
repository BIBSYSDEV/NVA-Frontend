import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import { Box, Skeleton, SxProps, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from '../../../api/cristinApi';
import { PublicationPointsTypography } from '../../../components/PublicationPointsTypography';
import { alternatingNviTableRowColor } from '../../../themes/mainTheme';
import { Approval, NviCandidateStatus } from '../../../types/nvi.types';
import { getLanguageString } from '../../../utils/translation-helpers';

interface NviApprovalsProps {
  approvals: Approval[];
}

export const NviApprovals = ({ approvals }: NviApprovalsProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ m: '1rem', border: '1px solid', borderColor: 'nvi.main' }}>
      <Table size="small" sx={alternatingNviTableRowColor}>
        <TableHead>
          <TableRow>
            <TableCell>{t('common.institution')}</TableCell>
            <TableCell>{t('tasks.nvi.nvi_status')}</TableCell>
            <TableCell align="right">{t('tasks.nvi.nvi_points')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {approvals.map((approvalStatus) => (
            <InstitutionApprovalStatusRow key={approvalStatus.institutionId} approvalStatus={approvalStatus} />
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

interface InstitutionApprovalStatusRowProps {
  approvalStatus: Approval;
}

const InstitutionApprovalStatusRow = ({ approvalStatus }: InstitutionApprovalStatusRowProps) => {
  const { t } = useTranslation();

  const institutionQuery = useQuery({
    queryKey: [approvalStatus.institutionId],
    queryFn: () => fetchOrganization(approvalStatus.institutionId),
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    gcTime: 1_800_000,
  });

  return (
    <TableRow>
      <TableCell>
        {institutionQuery.isPending ? (
          <Skeleton />
        ) : (
          <Typography>{institutionQuery.data?.acronym ?? getLanguageString(institutionQuery.data?.labels)}</Typography>
        )}
      </TableCell>
      <TableCell>
        <InstitutionStatus status={approvalStatus.status} />
      </TableCell>
      <TableCell align="right">
        <PublicationPointsTypography sx={{ whiteSpace: 'nowrap' }} points={approvalStatus.points} />
      </TableCell>
    </TableRow>
  );
};

interface InstitutionStatusProps {
  status: NviCandidateStatus;
}

const InstitutionStatus = ({ status }: InstitutionStatusProps) => {
  const { t } = useTranslation();

  const iconProps: SxProps = { mr: '0.2rem' };
  const icon =
    status === 'New' ? (
      <HourglassEmptyIcon fontSize="small" sx={iconProps} />
    ) : status === 'Pending' ? (
      <PendingOutlinedIcon fontSize="small" sx={iconProps} />
    ) : status === 'Approved' ? (
      <CheckIcon fontSize="small" sx={iconProps} />
    ) : status === 'Rejected' ? (
      <ClearIcon fontSize="small" sx={iconProps} />
    ) : null;

  return (
    <Box sx={{ display: 'flex' }}>
      {icon}
      <Typography sx={{ whiteSpace: 'nowrap' }}>{t(`tasks.nvi.status.${status}`)}</Typography>
    </Box>
  );
};
