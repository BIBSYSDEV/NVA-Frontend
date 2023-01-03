import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const EditorDoi = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h2">{t('editor.doi.digital_object_identifier')}</Typography>
    </>
  );
};
