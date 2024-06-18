import { Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const SelectInstitutionSkeleton = () => {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="h3" sx={{ fontWeight: 'normal' }}>
        {t('common.select_institution')}
      </Typography>
      <Skeleton height={90} />
      <Typography variant="h3" sx={{ marginTop: '1rem', fontWeight: 'normal' }}>
        {t('common.select_unit')}
      </Typography>
      <Skeleton height={90} />
    </>
  );
};
