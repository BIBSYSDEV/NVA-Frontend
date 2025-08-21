import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface SourceValueProps {
  label: string;
  value: string | null | undefined;
}

export const SourceValue = ({ label, value = '' }: SourceValueProps) => {
  const { t } = useTranslation();

  return (
    <Box component="dl" sx={{ m: 0, p: '0.5rem', bgcolor: '#FEFBF3' }}>
      <dt style={{ fontWeight: 'bold' }}>{label}</dt>
      <dd style={{ margin: 0, fontStyle: value ? 'normal' : 'italic' }}>{value || t('missing_value')}</dd>
    </Box>
  );
};
