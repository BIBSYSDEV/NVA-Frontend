import InsertPageBreakIcon from '@mui/icons-material/InsertPageBreak';
import { useTranslation } from 'react-i18next';

export const DoesNotSupportFileIcon = () => {
  const { t } = useTranslation();
  return <InsertPageBreakIcon titleAccess={t('editor.does_not_support_file_upload')} fontSize="small" />;
};
