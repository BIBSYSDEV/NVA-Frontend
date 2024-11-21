import FolderOffIcon from '@mui/icons-material/FolderOff';
import { useTranslation } from 'react-i18next';

export const DoesNotSupportFileIcon = () => {
  const { t } = useTranslation();
  return <FolderOffIcon titleAccess={t('editor.does_not_support_file_upload')} fontSize="small" />;
};
