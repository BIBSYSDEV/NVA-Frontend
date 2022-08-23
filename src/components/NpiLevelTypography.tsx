import { Typography, TypographyProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface NpiLevelTypographyProps extends TypographyProps {
  level?: string;
}

export const NpiLevelTypography = ({ level, ...typographyProps }: NpiLevelTypographyProps) => {
  const { t } = useTranslation();

  return (
    <Typography {...typographyProps}>
      {t('registration.resource_type.level')}: {level ?? t('common.not_applicable')}
    </Typography>
  );
};
