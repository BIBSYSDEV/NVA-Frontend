import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ApprovalSearch } from './_components/ApprovalSearch';
import { useApprovalDraft } from './ApprovalDraftContext';

export const RelatedApprovalField = () => {
  const { t } = useTranslation();
  const { approval, setApproval } = useApprovalDraft();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="h2">{t('related_approval')}</Typography>
      <Typography>{t('related_approval_description')}</Typography>
      <ApprovalSearch selectedApproval={approval} onChange={setApproval} />
    </Box>
  );
};
