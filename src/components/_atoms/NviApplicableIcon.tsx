import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import { useTranslation } from 'react-i18next';

export const NviApplicableIcon = () => {
  const { t } = useTranslation();
  return (
    <FilterVintageIcon titleAccess={t('registration.resource_type.nvi.can_give_publication_points')} fontSize="small" />
  );
};
