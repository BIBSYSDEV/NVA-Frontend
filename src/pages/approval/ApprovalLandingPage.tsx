import { Box, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { HeadTitle } from '../../components/HeadTitle';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { TruncatableTypography } from '../../components/TruncatableTypography';
import { PrimaryColoredBox } from '../../styles/header-styles';
import { ApprovalDetails, ApprovalView } from '../../types/approval.types';
import { ApprovalGeneralInfo } from './_components/ApprovalGeneralInfo';
import { ApprovalMembers } from './_components/ApprovalMembers';

interface ApprovalLandingPageProps {
  approvalView: ApprovalView;
  approval?: ApprovalDetails;
}

export const ApprovalLandingPage = ({ approvalView, approval }: ApprovalLandingPageProps) => {
  const { t } = useTranslation();

  return (
    <Paper elevation={0}>
      <HeadTitle>{approvalView.title}</HeadTitle>
      <PrimaryColoredBox sx={{ borderLeft: '1.5rem solid', borderColor: 'approval.main' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ color: 'inherit', mb: '0.5rem' }}>{t('approval')}</Typography>
          <TruncatableTypography variant="h1" sx={{ color: 'inherit' }}>
            {approvalView.title}
          </TruncatableTypography>
        </Box>
      </PrimaryColoredBox>
      <BackgroundDiv sx={{ bgcolor: 'white' }}>
        <ApprovalGeneralInfo approvalView={approvalView} approval={approval} />
        <ApprovalMembers trialSites={approvalView.trialSites ?? []} />
      </BackgroundDiv>
    </Paper>
  );
};
