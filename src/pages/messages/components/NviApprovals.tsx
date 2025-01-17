import CheckIcon from '@mui/icons-material/Check';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Box, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { PublicationPointsTypography } from '../../../components/PublicationPointsTypography';
import { Approval, NviCandidateStatus } from '../../../types/nvi.types';
import { getLanguageString } from '../../../utils/translation-helpers';

interface NviApprovalsProps {
  approvals: Approval[];
}

export const NviApprovals = ({ approvals }: NviApprovalsProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ border: '1px solid', borderColor: 'nvi.main', gridArea: 'approvals' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'nvi.main' }}>
            <TableCell>{t('common.institution')}</TableCell>
            <TableCell>{t('common.status')}</TableCell>
            <TableCell align="right">{t('common.points')}</TableCell>
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
  const institutionQuery = useFetchOrganization(approvalStatus.institutionId);

  return (
    <TableRow
      sx={{
        bgcolor:
          approvalStatus.status === 'Approved'
            ? 'nvi.light'
            : approvalStatus.status === 'Rejected'
              ? 'secondary.dark'
              : 'white',
      }}>
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

  const icon =
    status === 'New' || status === 'Pending' ? (
      <HourglassEmptyIcon fontSize="small" />
    ) : status === 'Approved' ? (
      <CheckIcon fontSize="small" />
    ) : status === 'Rejected' ? (
      <DoNotDisturbIcon fontSize="small" />
    ) : null;

  return (
    <Box sx={{ display: 'flex', gap: '0.2rem' }}>
      {icon}
      <Typography sx={{ whiteSpace: 'nowrap' }}>{t(`tasks.nvi.status.${status}`)}</Typography>
    </Box>
  );
};
