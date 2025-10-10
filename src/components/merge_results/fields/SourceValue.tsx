import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface SourceValueProps {
  label: string;
  value: ReactNode;
}

export const SourceValue = ({ label, value }: SourceValueProps) => {
  const { t } = useTranslation();

  return (
    <Box component="dl" sx={{ m: 0, p: '0.5rem', bgcolor: 'background.neutral87' }}>
      <dt style={{ fontWeight: 'bold' }}>{label}</dt>
      <dd style={{ margin: 0, fontStyle: value ? 'normal' : 'italic' }}>{value || t('missing_value')}</dd>
    </Box>
  );
};
