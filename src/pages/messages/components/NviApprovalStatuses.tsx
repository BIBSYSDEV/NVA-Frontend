import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from '../../../api/cristinApi';
import { PublicationPointsTypography } from '../../../components/PublicationPointsTypography';
import { ApprovalStatus } from '../../../types/nvi.types';
import { getLanguageString } from '../../../utils/translation-helpers';

interface NviApprovalStatusesProps {
  approvalStatuses: ApprovalStatus[];
}

export const NviApprovalStatuses = ({ approvalStatuses }: NviApprovalStatusesProps) => {
  const { t } = useTranslation();
  const publicationPointsSum = approvalStatuses.reduce((acc, status) => acc + status.points, 0);

  return (
    <Box sx={{ m: '1rem' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          mb: '0.5rem',
        }}>
        <Typography>{t('tasks.nvi.publication_points')}</Typography>
        {publicationPointsSum && <PublicationPointsTypography points={publicationPointsSum} />}
      </Box>

      {approvalStatuses.length > 0 && (
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
          {approvalStatuses.map((approvalStatus) => (
            <InstitutionApprovalStatusRow key={approvalStatus.institutionId} approvalStatus={approvalStatus} />
          ))}
        </Paper>
      )}
    </Box>
  );
};

interface InstitutionApprovalStatusRowProps {
  approvalStatus: ApprovalStatus;
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

  return (
    <>
      {institutionQuery.isLoading ? (
        <Skeleton sx={{ width: '8rem' }} />
      ) : (
        <Typography>{getLanguageString(institutionQuery.data?.labels)}</Typography>
      )}
      <Typography sx={{ whiteSpace: 'nowrap' }}>{t(`tasks.nvi.status.${approvalStatus.status}`)}</Typography>
      <PublicationPointsTypography sx={{ whiteSpace: 'nowrap' }} points={approvalStatus.points} />
    </>
  );
};
