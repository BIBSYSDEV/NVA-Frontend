import CheckIcon from '@mui/icons-material/Check';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Box, Skeleton, SxProps, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from '../../../api/cristinApi';
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
      <Table size="small" sx={alternatingNviTableRowColor}>
        <TableHead>
          <TableRow>
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

const alternatingNviTableRowColor: SxProps = {
  thead: {
    tr: {
      bgcolor: 'nvi.main',
      th: {
        fontWeight: 'normal',
        whiteSpace: 'nowrap',
        p: '0.5rem',
      },
    },
  },
  tbody: {
    tr: {
      bgcolor: 'nvi.light',
      '&:nth-of-type(even)': {
        bgcolor: 'white',
      },
      td: {
        p: '0.5rem',
      },
    },
  },
};
