import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from '../../../api/cristinApi';
import { PublicationPointsTypography } from '../../../components/PublicationPointsTypography';
import { Approval } from '../../../types/nvi.types';
import { getLanguageString } from '../../../utils/translation-helpers';

interface NviApprovalsProps {
  approvals: Approval[];
  totalPoints: number;
}

export const NviApprovals = ({ approvals, totalPoints }: NviApprovalsProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ m: '1rem' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          mb: '0.5rem',
        }}>
        <Typography>{t('tasks.nvi.publication_points')}</Typography>
        {totalPoints && <PublicationPointsTypography points={totalPoints} />}
      </Box>

      {approvals.length > 0 && (
        <Paper
          elevation={4}
          sx={{
            bgcolor: 'nvi.light',
            p: '0.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, auto)',
            gap: '0.5rem 0.75rem',
            alignItems: 'center',
          }}>
          {approvals.map((approvalStatus) => (
            <InstitutionApprovalStatusRow key={approvalStatus.institutionId} approvalStatus={approvalStatus} />
          ))}
        </Paper>
      )}
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
    <>
      {institutionQuery.isPending ? (
        <Skeleton sx={{ width: '8rem' }} />
      ) : (
        <Typography>{getLanguageString(institutionQuery.data?.labels)}</Typography>
      )}
      <Typography sx={{ whiteSpace: 'nowrap' }}>{t(`tasks.nvi.status.${approvalStatus.status}`)}</Typography>
      <PublicationPointsTypography sx={{ whiteSpace: 'nowrap' }} points={approvalStatus.points} />
    </>
  );
};
