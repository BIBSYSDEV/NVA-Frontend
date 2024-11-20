import PersonIcon from '@mui/icons-material/Person';
import { Box, Typography, TypographyProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface PersonIconHeaderProps {
  textColor?: TypographyProps['color'];
}

export const PersonIconHeader = ({ textColor }: PersonIconHeaderProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
      <PersonIcon sx={{ bgcolor: 'person.main', borderRadius: '0.25rem' }} />
      <Typography color={textColor}>{t('common.person')}</Typography>
    </Box>
  );
};
