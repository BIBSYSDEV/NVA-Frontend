import { Box, Skeleton, Typography } from '@mui/material';
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
  const checkedApprovals = approvals.filter(
    (approval) => approval.status === 'Approved' || approval.status === 'Rejected'
  );

  return (
    <Box sx={{ m: '1rem', border: '0.5px solid', borderColor: 'nvi.main' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          pb: '0.25rem',
          bgcolor: 'nvi.main',
        }}>
        <Typography fontWeight="bold" sx={{ alignSelf: 'center', my: '0.5rem' }}>
          {t('tasks.nvi.approval_status_count', { checked: checkedApprovals.length, total: approvals.length })}
        </Typography>

        {approvals.length > 0 && (
          <Box
            sx={{
              bgcolor: 'white',
              p: '0.5rem',
              display: 'grid',
              gridTemplateColumns: '1fr 3fr 1fr',
              justifyItems: 'center',
              gap: '0.5rem',
            }}>
            {approvals.map((approvalStatus) => (
              <InstitutionApprovalStatusRow key={approvalStatus.institutionId} approvalStatus={approvalStatus} />
            ))}
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 3fr 1fr',
          bgcolor: 'nvi.light',
          justifyItems: 'center',
          my: '0.25rem',
        }}>
        <section>=</section>
        <Typography>{t('tasks.nvi.publication_points')}</Typography>
        {totalPoints && <PublicationPointsTypography points={totalPoints} />}
      </Box>
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
    cacheTime: 1_800_000,
  });

  const institutionAcronym = institutionQuery.data?.acronym ?? '';

  return (
    <>
      {institutionQuery.isLoading ? (
        <Skeleton sx={{ width: '8rem' }} />
      ) : (
        <Typography>
          {institutionAcronym ? institutionAcronym : getLanguageString(institutionQuery.data?.labels)}
        </Typography>
      )}
      <Typography sx={{ whiteSpace: 'nowrap', justifySelf: 'center' }}>
        {t(`tasks.nvi.status.${approvalStatus.status}`)}
      </Typography>
      <PublicationPointsTypography sx={{ whiteSpace: 'nowrap' }} points={approvalStatus.points} />
    </>
  );
};
